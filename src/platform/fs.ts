import { isTauri } from "@tauri-apps/api/core";
import { addItem, getAllItems, getItem, putItem } from "../db/db";
import { searchMangaSeriesByName } from "../clients/AniList";
import { Series } from "../models/Series";
import { Library } from "../models/Library";

let fsModulePromise: Promise<any> | null = null;

function loadFsModule() {
  if (!fsModulePromise) {
    fsModulePromise = (window.__TAURI_INTERNALS__)
      ? import("./fs.tauri")
      : import("./fs.web");
  }
  return fsModulePromise;
}

export async function requestLibraryFolderAccess(...args) {
  const mod = await loadFsModule();
  return mod.requestLibraryFolderAccess(...args);
}

export async function constructLibrary(...args) {
  const mod = await loadFsModule();
  return mod.constructLibrary(...args);
}

export async function getChapterPages(...args) {
  const mod = await loadFsModule();
  return mod.getChapterPages(...args);
}

export async function verifyPermission(...args) {
    const mod = await loadFsModule();
    return mod.verifyPermission(...args);
}

export async function toBlobUrl(...args) {
    const mod = await loadFsModule();
    return mod.toBlobUrl(...args);
}



// ----- CROSS-PLATFORM FUNUCTIONS -----
export async function getPermissions() {
    const tauri = isTauri();
    const libraryHandle = await getItem<Library>("library_handle", "root")
        .then(res => res.handle)
        .catch(async () => await requestLibraryFolderAccess());

    if (!tauri) {
        await verifyPermission(libraryHandle);
    }
}

/**
* Refreshes library, wipes metadata, refetches metadata, only use on first startup
* and total database rewrites.
*/
export async function hardRefreshLibrary(refreshIndicator) {
    await getPermissions();
    
    const libraryHandle = await getItem<Library>("library_handle", "root")
        .then(res => res.handle);
    
    const library = await constructLibrary(libraryHandle);
    const seriesList = await AniListToLocalMetadata(library);

    for (const series of seriesList) {
        addItem<Series>("local_library", series)
            .then(result => {
                console.log("Added series to indexedDB under 'local_library' store");
            })
            .catch(error => {
                console.error("Failed to add series to indexedDB under 'local_library' store: ", error);
            });
    }

    await refreshIndicator(false);
}

/**
* Refreshes library by getting new series from disk and checking if it exists
* already with metadata before adding to the database.
*/
export async function softRefreshLibrary(refreshIndicator) {
    refreshIndicator(true);
    
    const oldLibrary = await getAllItems<Series>("local_library");
    if (oldLibrary.length === 0) {
        await hardRefreshLibrary(refreshIndicator);
        return;
    }
    
    await getPermissions();
    const libraryHandle = await getItem<Library>("library_handle", "root")
        .then(res => res?.handle);
    
    const newLibrary = await constructLibrary(libraryHandle);

    const existingTitles = new Set(oldLibrary.map(item => item.title));
    const newTitles = newLibrary.filter(item => !existingTitles.has(item.title));

    const newSeriesList = await AniListToLocalMetadata(newTitles);

    for (const series of newSeriesList) {
        addItem<Series>("local_library", series)
            .then(result => {
                console.log("Added series to indexedDB under 'local_library' store");
            })
            .catch(error => {
                console.error("Failed to add series to indexedDB under 'local_library' store: ", error);
            });
    }
    
    await refreshIndicator(false);
}

const VALID_STAFF_OCCUPATIONS = ["Mangaka", "Writer", "Illustrator", "Artist"];
export async function AniListToLocalMetadata(seriesList: Series[]): Promise<Series[]> {
    const updatedSeriesList: Series[] = [];
    
    for (let series of seriesList) {
        if (series.al_id) { // TODO: Handle series not found on anilist (probably use some marker)
            continue;
        }

        try {
            let data = await searchMangaSeriesByName(series.title)
            
            let updatedSeries = series;

            const res = data.data.Media;
            updatedSeries.al_id = res.id;
            updatedSeries.al_rating = res.averageScore;
            updatedSeries.description = res.description.replace(/<br\s*\/?>/gi, '');
            updatedSeries.status = res.status;
            updatedSeries.covers.push({ name: "AniList Cover", cover_image: res.coverImage.extraLarge})
            updatedSeries.banner = res.bannerImage;
            updatedSeries.start_year = res.startDate.year;
            updatedSeries.end_year = res.endDate.year;
            updatedSeries.mal_id = res.idMal;
            updatedSeries.al_link = res.siteUrl;

            for (const staff of res.staff.nodes) {
                if (res.staff.nodes.length === 1) {
                    updatedSeries.staff.push(staff.name.full);
                }

                for (const occupation of staff.primaryOccupations) {
                    if (VALID_STAFF_OCCUPATIONS.includes(occupation)) {
                        updatedSeries.staff.push(staff.name.full);
                    }
                }
            }
            
            updatedSeries.original_lang = res.countryOfOrigin;
            switch (updatedSeries.original_lang) {
                case "JP":
                    updatedSeries.type = "Manga";
                    break;
                case "KR":
                    updatedSeries.type = "Manhwa";
                    break;
                case "CN":
                    updatedSeries.type = "Manhua";
                    break;
                default:
                    updatedSeries.type = "Unknown";
            }

            updatedSeriesList.push(updatedSeries);
        } catch (error) {
            console.log(error);
        }
    }

    return updatedSeriesList;
}

