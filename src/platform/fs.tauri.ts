import { open } from '@tauri-apps/plugin-dialog';
import { DirEntry, readDir, readFile } from '@tauri-apps/plugin-fs';
import { Series } from '../models/Series';
import { Chapter } from '../models/Chapter';
import { chapterRegex, imageRegex, volumeRegex } from './fs';
import { Volume } from '../models/Volume';

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
            const series: Series = await constructSeries(path, e);
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

    const seriesPath = path + "/" + parentHandle.name;
    const seriesEntries = await readDir(seriesPath);
    
    const orphanedChapterList: Chapter[] = [];
    const volumes: Volume[] = [];

    for (const e of seriesEntries) {
        console.log(e);
        if (e.isDirectory) {
            if (volumeRegex.test(e.name)) {
                // TODO: do volume stuff
            } else if (chapterRegex.test(e.name)) {
                const chapter: Chapter = await constructChapter(path, e);
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
    const chapterPath = path + "/" + parentHandle.name;
    const chapterEntries = await readDir(chapterPath);
    
    const pagePaths: string[] = []; // TODO: change to image blobs or paths?
    for (const e of chapterEntries) {
        if (e.isFile) {
            if (imageRegex.test(e.name)) {
                const pagePath = path + "/" + e.name;
                pagePaths.push(pagePath);
            }
        }
    }

    return { title: parentHandle.name, page_count: pagePaths.length, pages: pagePaths };
}
