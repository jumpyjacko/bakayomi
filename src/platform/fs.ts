import { isTauri } from "@tauri-apps/api/core";
import { getAllItems, getItem, putItem } from "../db/db";
import { searchMangaSeriesByName } from "../clients/AniList";

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
* Refreshes library via recalculating disk from the handle stored in IndexedDB.
* Deliberately leaks due to levelDB stuff. Should compact over time?
*/
export async function hardRefreshLibrary() {
    await getPermissions();
    
    const libraryHandle = await getItem<Library>("library_handle", "root")
        .then(res => res.handle);
    
    const library = await constructLibrary(libraryHandle);
    const seriesList = await AniListToLocalMetadata(library);

    console.log(seriesList);

    for (const series of seriesList) {
        console.log(series);
        putItem<Series>("local_library", series)
            .then(result => {
                console.log("Added series to indexedDB under 'local_library' store");
            })
            .catch(error => {
                console.error("Failed to add series to indexedDB under 'local_library' store: ", error);
            });
    }
}

export async function softRefreshLibrary() {
    await getPermissions();

    const libraryHandle = await getItem<Library>("library_handle", "root")
        .then(res => res.handle);
    
    const oldLibrary = await getAllItems<Series>("local_library");

    console.log(oldLibrary);

    if (oldLibrary.length === 0) {
        await hardRefreshLibrary();
        return;
    }
}

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
            updatedSeries.description = res.description;
            updatedSeries.status = res.status;
            updatedSeries.covers.push({ name: "AniList Cover", cover_image: res.coverImage.extraLarge})

            for (const author of res.staff.nodes) {
                console.log(author);
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

