import { Series } from "../models/Series";
import { Volume } from "../models/Volume";

export async function requestLibraryFolderAccess(): Promise<Series[] | undefined> {
    try {
        const dirHandle: FileSystemDirectoryHandle = await window.showDirectoryPicker();

        // NOTE: unsure if dirHandle.name is the best way to get a series name
        return [{ title: dirHandle.name, handle: dirHandle, cover: undefined, volumes: undefined }];
    } catch (err) {
        console.error("User cancelled folder access or permission denied: ", err);
        return;
    }
}

export async function constructSeries(handle: FileSystemDirectoryHandle): Promise<Volume[] | undefined> {
    if (!handle) {
        // FIXME: proper error handling
        console.error("No handle provided.");
        return undefined;
    }

    const volumes: Volume[] = [];
    const structureIsVolumes = true;

    for await (const [name, h] of handle.entries() as AsyncIterable<[string, FileSystemHandle]>) {
        if (h.kind === 'directory') {
            if (name.match(/\b[Vv]o?l?u?m?e?/)) {
                // TODO: do volume stuff
            } else {
                // TODO: do chapter stuff (make a dummy vol 1 entry)
            }
        } else {
            // TODO: do something idk
        }
    }

    return volumes;
}

async function constructVolume(handle: FileSystemDirectoryHandle): Promise<Volume | undefined> {
    for await (const [name, h] of handle.entries() as AsyncIterable<[string, FileSystemHandle]>) {
        if (h.kind === 'directory') {
            if (name.match(/\b[Cc]h?a?p?t?e?r?/)) {
            } else {
                // FIXME: do error handling (no found chapters?)
            }
        } else {
            // TODO: check for cover.png and make it the volume cover, otherwise, error handling
        }
    }
}

// export async function getInnerFiles(dirHandle: FileSystemDirectoryHandle) {
//     if (!dirHandle) {
//         console.error("No handle provided.");
//     }
//
//     const entries = [];
//
//     for await(const [name, handle] of dirHandle.entries()) {
//         entries.push({ name, handle })
//     }
//
//     return entries;
// }
