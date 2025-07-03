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
