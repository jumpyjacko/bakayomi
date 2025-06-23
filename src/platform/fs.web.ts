import { addItem } from "../db/db";
import { Chapter } from "../models/Chapter";
import { Library } from "../models/Library";
import { Series } from "../models/Series";
import { Volume } from "../models/Volume";

const volumeRegex = /\b[Vv]o?l?u?m?e?/;
const chapterRegex = /\b[Cc]h?a?p?t?e?r?/;
const imageRegex = /(\.png)?(\.jpg)?(\.gif)?(\.webp)?/;

export async function requestLibraryFolderAccess(): Promise<Series[]> {
    try {
        const handle: FileSystemDirectoryHandle = await window.showDirectoryPicker();

        const seriesList: Series[] = [];
        
        for await (const [name, h] of handle.entries() as AsyncIterable<[string, FileSystemHandle]>) {
            if (h.kind === 'directory') {
                const series: Series = await constructSeries(h as FileSystemDirectoryHandle);
                seriesList.push(series);
            } else {
                // TODO: do something
            }
        }

        addItem<Library>("library_handle", { id: "root", handle } as Library)
            .then(result => {
                console.log("Added library handle to IDB");
            })
            .catch(error => {
                console.error("Failed adding library handle to IDB");
            });

        return seriesList;
    } catch (err) {
        throw new Error(`User cancelled folder access or permission denied: ${err}`);
    }
}

async function constructSeries(handle: FileSystemDirectoryHandle): Promise<Series> {
    if (!handle) {
        // FIXME: proper error handling
        throw new Error("No handle.");
    }

    // NOTE: holds orphaned chapters (not belonging to a volume)
    const orphanedChapterList: Chapter[] = [];
    const volumes: Volume[] = [];

    for await (const [name, h] of handle.entries() as AsyncIterable<[string, FileSystemHandle]>) {
        if (h.kind === 'directory') {
            if (volumeRegex.test(name)) {
                const volume: Volume = await constructVolume(h as FileSystemDirectoryHandle);
                volumes.push(volume);
            } else if (chapterRegex.test(name)) {
                const chapter: Chapter = await constructChapter(h as FileSystemDirectoryHandle);
                orphanedChapterList.push(chapter);
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

    return { title: handle.name, cover_index: 0, volumes };
}

async function constructVolume(handle: FileSystemDirectoryHandle): Promise<Volume> {
    const chapters: Chapter[] = [];

    for await (const [name, h] of handle.entries() as AsyncIterable<[string, FileSystemHandle]>) {
        if (h.kind === 'directory') {
            if (chapterRegex.test(name)) {
                const chapter: Chapter = await constructChapter(h as FileSystemDirectoryHandle);
                chapters.push(chapter);
            }
        } else {
            // TODO: check for cover.png and make it the volume cover, otherwise, error handling
        }
    }

    return { title: handle.name, chapter_count: chapters.length, chapters };
}

async function constructChapter(handle: FileSystemDirectoryHandle): Promise<Chapter> {
    const pages: FileSystemFileHandle[] = []; // TODO: change to image blobs or paths?
    for await (const [name, h] of handle.entries() as AsyncIterable<[string, FileSystemHandle]>) {
        if (h.kind === 'file') {
            if (imageRegex.test(name)) {
                pages.push(h as FileSystemFileHandle);
            }
        } else {
            // TODO: error handle (directory found)
        }
    }

    return { title: handle.name, page_count: pages.length, pages };
}


export async function verifyPermission(handle, mode = 'read') {
    const options = { mode };

    let permission = await handle.queryPermission(options);
    if (permission === 'granted') return true;

    permission = await handle.requestPermission(options);
    return permission === 'granted';
}
