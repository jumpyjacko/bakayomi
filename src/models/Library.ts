import { isTauri } from "@tauri-apps/api/core";
import { getAllItems, getItem, putItem } from "../db/db";
import { constructLibrary, requestLibraryFolderAccess, verifyPermission } from "../platform/fs";
import { searchMangaSeriesByName } from "../clients/AniList";
import { Series } from "./Series";

export interface Library {
    id: string,
    handle: FileSystemDirectoryHandle | string,
}

/**
* Refreshes library via recalculating disk from the handle stored in IndexedDB.
* Deliberately leaks due to levelDB stuff. Should compact over time?
*/
export async function refreshLibrary() {
    const tauri = isTauri();
    const libraryHandle = await getItem<Library>("library_handle", "root")
        .then(res => res.handle)
        .catch(async () => await requestLibraryFolderAccess());

    if (!tauri) {
        await verifyPermission(libraryHandle);
    }

    constructLibrary(libraryHandle);
}

export async function AniListToLocalMetadata() {
    const library: Series[] = await getAllItems<Series>("library");

    for (let series of library) {
        if (series.al_id) { // TODO: Handle series not found on anilist (probably use some marker)
            continue;
        }

        searchMangaSeriesByName(series.title)
        .then(updateSeries)
        .catch(handleError);

        async function updateSeries(data) {
            console.log(data);

            const res = data.data.Media;
            series.al_id = res.id;
            series.author = res.staff.nodes[0]; // TODO: change this to handle multiple authors and filter for 'Mangaka' occupation
            series.description = res.description;
            series.original_lang = res.countryOfOrigin;
            series.status = res.status;
            series.covers.push({ name: "AniList Cover", cover_image: res.coverImage.extraLarge})

            switch (series.original_lang) {
                case "JP":
                    series.type = "Manga";
                    break;
                case "KR":
                    series.type = "Manhwa";
                    break;
                case "CN":
                    series.type = "Manhua";
                    break;
                default:
                    series.type = "Unknown";
            }

            putItem<Series>("library", series);
        }

        async function handleError(error) {
            console.log(error);
        }
    }
}
