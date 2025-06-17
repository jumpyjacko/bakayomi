import { Series } from "../models/Series";

export async function requestLibraryFolderAccess(): Promise<Series[] | undefined> {
    try {
        const dirHandle: FileSystemDirectoryHandle = await window.showDirectoryPicker();

        // NOTE: unsure if dirHandle.name is the best way to get a series name
        return [{ title: dirHandle.name, handle: dirHandle }];
    } catch (err) {
        console.error("User cancelled folder access or permission denied: ", err);
        return;
    }
}

export async function getInnerFiles(dirHandle: FileSystemDirectoryHandle) {
    if (!dirHandle) {
        console.error("No handle provided.");
    }

    const entries = [];

    for await(const [name, handle] of dirHandle.entries()) {
        entries.push({ name, handle })
    }

    return entries;
}
