import { open } from '@tauri-apps/plugin-dialog';
import { DirEntry, readDir } from '@tauri-apps/plugin-fs';
import { Series } from '../models/Series';
import { Chapter } from '../models/Chapter';
import { chapterRegex, volumeRegex } from './fs';

export async function requestLibraryFolderAccess(): Promise<Series[] | undefined> {
    const path: string | null = await open({
        multiple: false,
        directory: true,
    });

    if (!path) {
        return;
    }
    
    const dirEntries = await readDir(path);

    for (const e of dirEntries) {
        if (e.isDirectory) {
            // NOTE: wary of windows?
            const seriesPath = path + "/" + e.name;
            const seriesEntries = await readDir(seriesPath);
            const series: Series = await constructSeries(seriesPath, seriesEntries);
        }
    }
}

async function constructSeries(path: string, entries: DirEntry[]): Promise<Series> {
    if (!entries) {
        throw new Error("No handle provided.");
    }
    if (!path) {
        throw new Error("No path provided.");
    }

    const orphanedChapterList: Chapter[] = [];
    const volumes: Volume[] = [];

    for (const e of entries) {
        console.log(e);
        if (e.isDirectory) {
            if (volumeRegex.test(e.name)) {
                // TODO: do volume stuff
            } else if (chapterRegex.test(e.name)) {
                const chapterPath = path + "/" + e.name;
                const chapterEntries = await readDir(chapterPath);
                const chapter: Chapter = await constructChapter(chapterPath, chapterEntries);
                
            }
        }
    }
}

async function constructVolume(path: string, entries: DirEntry[]) {
}
