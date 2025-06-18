import { open } from '@tauri-apps/plugin-dialog';
import { DirEntry, readDir } from '@tauri-apps/plugin-fs';

import { chapterRegex, imageRegex, volumeRegex } from './fs';
import { Series } from '../models/Series';
import { Chapter } from '../models/Chapter';
import { Volume } from '../models/Volume';
import { join } from '@tauri-apps/api/path';

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
            const seriesPath = await join(path, e.name);
            const series: Series = await constructSeries(seriesPath, e);
            console.log(series);
        }
    }
}

async function constructSeries(path: string, parentHandle: DirEntry): Promise<Series> {
    if (!parentHandle) {
        throw new Error("No handle provided.");
    }
    if (!path) {
        throw new Error("No path provided.");
    }
    
    const orphanedChapterList: Chapter[] = [];
    const volumes: Volume[] = [];

    const seriesEntries = await readDir(path);

    for (const e of seriesEntries) {
        if (e.isDirectory) {
            if (volumeRegex.test(e.name)) {
                // TODO: do volume stuff
            } else if (chapterRegex.test(e.name)) {
                console.log("here");
                const chapterPath = await join(path, e.name);
                const chapter: Chapter = await constructChapter(chapterPath, e);
                orphanedChapterList.push(chapter);
            }
        }
    }

    if (orphanedChapterList.length !== 0) {
        const dummyVolume: Volume = {
            title: "Orphaned Chapters",
            chapter_count: orphanedChapterList.length,
            chapters: orphanedChapterList,
        };

        volumes.push(dummyVolume);
    }

    return { title: parentHandle.name, cover_index: 0, volumes };
}

async function constructVolume(path: string, entries: DirEntry) {
}

async function constructChapter(path: string, parentHandle: DirEntry): Promise<Chapter> {
    const chapterEntries = await readDir(path);
    
    const pagePaths: string[] = []; // TODO: change to image blobs or paths?
    for (const e of chapterEntries) {
        if (e.isFile) {
            if (imageRegex.test(e.name)) {
                const pagePath = await join(path, e.name);
                pagePaths.push(pagePath);
            }
        }
    }

    return { title: parentHandle.name, page_count: pagePaths.length, pages: pagePaths };
}
