import { DirEntry, readDir, readFile } from '@tauri-apps/plugin-fs';
import { open } from '@tauri-apps/plugin-dialog';
import { join } from '@tauri-apps/api/path';

import { putItem } from '../db/db';

import { Series } from '../models/Series';
import { Chapter } from '../models/Chapter';
import { Volume } from '../models/Volume';
import { Library } from '../models/Library';
import { Page } from '../models/Page';
import { Cover } from '../models/Cover';

const volumeRegex = /\b[Vv]o?l?u?m?e?/;
const chapterRegex = /\b[Cc]h?a?p?t?e?r?/;
const imageRegex = /(\.png)?(\.jpg)?(\.gif)?(\.webp)?/; // NOTE: Possibly replace with checking MIME type

export async function requestLibraryFolderAccess() {
    const path: string | null = await open({
        multiple: false,
        directory: true,
    });

    if (!path) {
        throw new Error("User cancelled folder access or permission denied.");
    }
    
    constructLibrary(path);
    putItem<Library>("library_handle", { id: "root", handle: path } as Library)
        .then(result => {
            console.log("Added library handle to IDB");
        })
        .catch(error => {
            console.error("Failed adding library handle to IDB");
        });

    return path;
}

export async function constructLibrary(path: string): Promise<Series[]> {
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
    const staff: string[] = [];
    let covers: Cover[] = [];

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
            } else if (e.name === "_covers") {
                const coversPath = await join(path, e.name);
                covers = await createCoversList(coversPath);
            }
        }
    }

    if (orphanedChapterList.length !== 0) {
        orphanedChapterList.sort((a, b) => a.title.localeCompare(b.title));
        
        const dummyVolume: Volume = {
            title: "No Volume",
            chapter_count: orphanedChapterList.length,
            chapters: orphanedChapterList,
        };

        volumes.push(dummyVolume);
    }

    let chapter_count = 0;
    for (const vol of volumes) {
        chapter_count += vol.chapter_count;
    }
    
    volumes.sort((a, b) => a.title.localeCompare(b.title));

    return { title: parentHandle.name, volumes, covers, staff, chapter_count };
}

async function createCoversList(path: string): Promise<Cover[]> {
    const coverEntries = await readDir(path);

    const covers: Cover[] = [];

    for (const e of coverEntries) {
        if (e.isFile) {
            const coverPath = await join(path, e.name);
            covers.push({ name: e.name, cover_image: coverPath, local: true });
        }
    }

    return covers;
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
        }
    }

    chapters.sort((a, b) => a.title.localeCompare(b.title));

    return { title: parentHandle.name, chapter_count: chapters.length, chapters };
}

async function constructChapter(path: string, parentHandle: DirEntry): Promise<Chapter> {
    const chapterEntries = await readDir(path);

    return { title: parentHandle.name, downloaded: true, handle: path };
}

export async function getChapterPages(path: string): Promise<Page[]> {
    const chapterEntries = await readDir(path);

    const pages: Page[] = [];
    for (const e of chapterEntries) {
        if (e.isFile) {
            if (imageRegex.test(e.name)) {
                const pagePath = await join(path, e.name);
                const blobUrl = await toBlobUrl(pagePath);

                pages.push({ uri: blobUrl, name: e.name });
            }
        }
    }

    return pages;
}

export async function toBlobUrl(path: string): Promise<string> {
    const file = await readFile(path);
    const blob = new Blob([file], { type: "image/jpeg" });
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
}

export async function verifyPermission() {
    return true;
}
