const fsModule = await ((window.__TAURI_INTERNALS__)
    ? import("./fs.tauri")
    : import("./fs.web"));

export const requestLibraryFolderAccess = fsModule.requestLibraryFolderAccess;
export const constructLibrary = fsModule.constructLibrary;
