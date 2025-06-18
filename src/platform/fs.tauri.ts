import { open } from '@tauri-apps/plugin-dialog';
import { DirEntry, readDir } from '@tauri-apps/plugin-fs';
import { Series } from '../models/Series';
import { Chapter } from '../models/Chapter';
import { volumeRegex } from './fs';

export async function requestLibraryFolderAccess(): Promise<Series[] | undefined> {
    const path: string | null = await open({
        multiple: false,
        directory: true,
    });

    if (!path) {
        return;
    }

    const dirHandle = await readDir(path);
}

async function constructSeries(handle: DirEntry[]): Promise<Series> {
    if (!handle) {
        throw new Error("No handle provided");
    }

    const orphanedChapterList: Chapter[] = [];
    const volumes: Volume[] = [];

    for (const h of handle) {
        if (h.isDirectory) {
            if (volumeRegex.test(h.name)) {
                const series: Series = await constructSeries(h);
            }
        }
    }
}
