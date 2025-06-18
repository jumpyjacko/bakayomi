const fsModule = await ((window.__TAURI_INTERNALS__)
    ? import("./fs.tauri")
    : import("./fs.web"));


export const volumeRegex = /\b[Vv]o?l?u?m?e?/;
export const chapterRegex = /\b[Cc]h?a?p?t?e?r?/;
export const imageRegex = /(\.png)?(\.jpg)?(\.gif)?/; // NOTE: Possibly replace with checking MIME type

export const requestLibraryFolderAccess = fsModule.requestLibraryFolderAccess;
