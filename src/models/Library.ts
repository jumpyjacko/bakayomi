import { isTauri } from "@tauri-apps/api/core";
import { verifyPermission } from "../platform/fs.web";
import { getItem } from "../db/db";
import { constructLibrary, requestLibraryFolderAccess } from "../platform/fs";

export interface Library {
    id: string,
    handle: FileSystemDirectoryHandle | string,
}

export async function openLibrary() {
    const tauri = isTauri();
    const libraryHandle = await getItem<Library>("library_handle", "root")
        .then(res => res.handle)
        .catch(async () => await requestLibraryFolderAccess());

    if (!tauri) {
        await verifyPermission(libraryHandle);
    }

    constructLibrary(libraryHandle);
}
