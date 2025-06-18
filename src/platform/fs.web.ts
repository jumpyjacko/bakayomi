import { volumeRegex, chapterRegex, imageRegex } from "./fs";
import { Chapter } from "../models/Chapter";
import { Series } from "../models/Series";
import { Volume } from "../models/Volume";

// TODO: make it return a Library
export async function requestLibraryFolderAccess(): Promise<Series[] | undefined> {
    try {
        const dirHandle: FileSystemDirectoryHandle = await window.showDirectoryPicker();

        const seriesList: Series[] = [];
        
        for await (const [name, h] of dirHandle.entries() as AsyncIterable<[string, FileSystemHandle]>) {
            if (h.kind === 'directory') {
                const series: Series = await constructSeries(h as FileSystemDirectoryHandle);
                seriesList.push(series);
            } else {
                // TODO: do something
            }
        }

        console.log(seriesList); // DEBUG 
        
        return seriesList;
    } catch (err) {
        console.error("User cancelled folder access or permission denied: ", err);
        return;
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
    let chapters: Chapter[] = [];

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

