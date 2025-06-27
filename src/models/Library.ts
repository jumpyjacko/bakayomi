import { isTauri } from "@tauri-apps/api/core";
import { getItem } from "../db/db";
import { constructLibrary, requestLibraryFolderAccess, verifyPermission } from "../platform/fs";

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

