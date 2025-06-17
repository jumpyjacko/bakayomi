import { open } from '@tauri-apps/plugin-dialog';
import { readDir } from '@tauri-apps/plugin-fs';
import { Series } from '../models/Series';

export async function requestLibraryFolderAccess(): Promise<Series[] | undefined> {
    const path: string | null = await open({
        multiple: false,
        directory: true,
    });

    if (!path) {
        return;
    }

    const dirHandle = await readDir(path);

    return [{ title: "name", handle: dirHandle }];
}
