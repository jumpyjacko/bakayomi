import { putItem } from "../db/db";

import { Chapter } from "../models/Chapter";
import { Cover } from "../models/Cover";
import { Library } from "../models/Library";
import { Page } from "../models/Page";
import { Series } from "../models/Series";
import { Volume } from "../models/Volume";

const volumeRegex = /\b[Vv]o?l?u?m?e?/;
const chapterRegex = /\b[Cc]h?a?p?t?e?r?/;
const imageRegex = /(\.png)?(\.jpg)?(\.gif)?(\.webp)?/;

export async function requestLibraryFolderAccess() {
    try {
        const handle: FileSystemDirectoryHandle = await window.showDirectoryPicker();

        constructLibrary(handle);
        putItem<Library>("library_handle", { id: "root", handle } as Library)
            .then(result => {
                console.log("Added library handle to IDB");
            })
            .catch(error => {
                console.error("Failed adding library handle to IDB");
            });

        return handle;
    } catch (err) {
        throw new Error(`User cancelled folder access or permission denied: ${err}`);
    }
}

export async function constructLibrary(handle: FileSystemDirectoryHandle): Promise<Series[]> {
    const seriesList: Series[] = [];
    
    for await (const [name, h] of handle.entries() as AsyncIterable<[string, FileSystemHandle]>) {
        if (h.kind === 'directory') {
            const series: Series = await constructSeries(h as FileSystemDirectoryHandle);
            seriesList.push(series);
        } else {
            // TODO: do something
        }
    }

    for (const series of seriesList) {
        putItem<Series>("library", series)
            .then(result => {
                console.log("Added series to indexedDB under 'library' store");
            })
            .catch(error => {
                console.error("Failed to add series to indexedDB under 'library' store: ", error);
            });
    }

    
    return seriesList;
}

async function constructSeries(handle: FileSystemDirectoryHandle): Promise<Series> {
    // NOTE: holds orphaned chapters (not belonging to a volume)
    const orphanedChapterList: Chapter[] = [];
    const volumes: Volume[] = [];
    let covers: Cover[] = [];

    for await (const [name, h] of handle.entries() as AsyncIterable<[string, FileSystemHandle]>) {
        if (h.kind === 'directory') {
            if (volumeRegex.test(name)) {
                const volume: Volume = await constructVolume(h as FileSystemDirectoryHandle);
                volumes.push(volume);
            } else if (chapterRegex.test(name)) {
                const chapter: Chapter = await constructChapter(h as FileSystemDirectoryHandle);
                orphanedChapterList.push(chapter);
            } else if (name === "_covers") {
                covers = await createCoversList(h as FileSystemDirectoryHandle);
            }
        } else {
            // TODO: do something idk
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

    // TODO: determine original language from some metadata (mal/al, idk?)
    return { title: handle.name, volumes, covers };
}

async function createCoversList(handle: FileSystemDirectoryHandle): Promise<Cover[]> {
    const covers: Cover[] = [];

    for await (const [name, h] of handle.entries() as AsyncIterable<[string, FileSystemHandle]>) {
        if (h.kind === "file") {
            covers.push({ name, cover_image: h as FileSystemFileHandle});
        }
    }

    return covers;
}

async function constructVolume(handle: FileSystemDirectoryHandle): Promise<Volume> {
    const chapters: Chapter[] = [];

    for await (const [name, h] of handle.entries() as AsyncIterable<[string, FileSystemHandle]>) {
        if (h.kind === 'directory') {
            if (chapterRegex.test(name)) {
                const chapter: Chapter = await constructChapter(h as FileSystemDirectoryHandle);
                chapters.push(chapter);
            }
        }
    }

    return { title: handle.name, chapter_count: chapters.length, chapters };
}

async function constructChapter(handle: FileSystemDirectoryHandle): Promise<Chapter> {
    const pages = await handle.entries();

    return { title: handle.name, downloaded: true, page_count: pages.length, handle };
}

export async function getChapterPages(handle: FileSystemDirectoryHandle): Promise<Page[]> {
    const pages: Page[] = [];

    for await (const [name, h] of handle.entries() as AsyncIterable<[string, FileSystemHandle]>) {
        if (h.kind === 'file') {
            if (imageRegex.test(name)) {
                const fileHandle = h as FileSystemFileHandle;
                const blobUrl = await toBlobUrl(fileHandle);

                pages.push({ uri: blobUrl, name });
            }
        }
    }

    return pages;
}


export async function verifyPermission(handle, mode = 'read') {
    const options = { mode };

    let permission = await handle.queryPermission(options);
    if (permission === 'granted') return true;

    permission = await handle.requestPermission(options);
    return permission === 'granted';
}

export async function toBlobUrl(handle: FileSystemFileHandle): Promise<string> {
    const file = await handle.getFile();
    const blob = new Blob([file], { type: "image/jpeg" });
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
}
