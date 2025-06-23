import { DirEntry, readDir } from '@tauri-apps/plugin-fs';
import { open } from '@tauri-apps/plugin-dialog';
import { join } from '@tauri-apps/api/path';

import { Series } from '../models/Series';
import { Chapter } from '../models/Chapter';
import { Volume } from '../models/Volume';

const volumeRegex = /\b[Vv]o?l?u?m?e?/;
const chapterRegex = /\b[Cc]h?a?p?t?e?r?/;
const imageRegex = /(\.png)?(\.jpg)?(\.gif)?(\.webp)?/; // NOTE: Possibly replace with checking MIME type

export async function requestLibraryFolderAccess(): Promise<Series[]> {
    const path: string | null = await open({
        multiple: false,
        directory: true,
    });

    if (!path) {
        throw new Error("User cancelled folder access or permission denied.");
    }
    
    const dirEntries = await readDir(path);
    const seriesList: Series[] = [];

    for (const e of dirEntries) {
        if (e.isDirectory) {
            const seriesPath = await join(path, e.name);
            const series: Series = await constructSeries(seriesPath, e);
            seriesList.push(series);
        }
    }

    return seriesList;
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
                const volumePath = await join(path, e.name);
                const volume: Volume = await constructVolume(volumePath, e);
                volumes.push(volume);
            } else if (chapterRegex.test(e.name)) {
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

async function constructVolume(path: string, parentHandle: DirEntry): Promise<Volume> {
    const volumeEntries = await readDir(path);

    const chapters: Chapter[] = [];

    for (const e of volumeEntries) {
        if (e.isDirectory) {
            if (chapterRegex.test(e.name)) {
                const chapterPath = await join(path, e.name);
                const chapter: Chapter = await constructChapter(chapterPath, e);
                chapters.push(chapter);
            }
        } else {
            // TODO: check for cover.png, otherwise error
        }
    }

    return { title: parentHandle.name, chapter_count: chapters.length, chapters };
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
