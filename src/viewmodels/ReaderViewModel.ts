import { createEffect, createSignal, onMount } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { isTauri } from "@tauri-apps/api/core";

import { Library } from "../models/Library";
import { Series } from "../models/Series";
import { Volume } from "../models/Volume";
import { Chapter } from "../models/Chapter";
import { Page } from "../models/Page";

import { getChapterPages, verifyPermission } from "../platform/fs";
import { getItem } from "../db/db";
import { Point } from "../utils/point";

export function createReaderViewModel() {
    const params = useParams();
    const navigate = useNavigate();

    const [pageList, setPageList] = createSignal<Page[]>([]);
    const [pageNumber, setPageNumber] = createSignal(0);
    const [currentPage, setCurrentPage] = createSignal<Page>();

    let volumeIdx: number;
    let chapterIdx: number;

    let series: Series | undefined;
    let volume: Volume;
    let chapter: Chapter;

    const [pageScale, setPageScale] = createSignal(1);
    const [pageTranslation, setPageTranslation] = createSignal<Point>(Point.zero());

    const [ocrActive, setOcrActive] = createSignal(false);

    onMount(async () => {
        const tauri = isTauri();

        if (!tauri) {
            const libraryHandle = await getItem<Library>("library_handle", "root");
            await verifyPermission(libraryHandle?.handle);
        }

        const seriesName = decodeURIComponent(params.series);
        const volumeName = decodeURIComponent(params.volume);
        const chapterName = decodeURIComponent(params.chapter);

        series = await getItem<Series>("local_library", seriesName); // TODO: Handle no series found (i.e. redirect to 404)
        volumeIdx = series!.volumes!.findIndex((v) => v.title === volumeName);
        volume = series!.volumes![volumeIdx];
        chapterIdx = volume.chapters.findIndex((c) => c.title === chapterName);
        chapter = volume.chapters[chapterIdx];

        const pages: Page[] = await getChapterPages(chapter?.handle);
        pages.sort((a, b) => a.name.localeCompare(b.name));

        setPageList(pages);
        setCurrentPage(pageList()[pageNumber()]);
    });

    createEffect(() => {
        const list = pageList();
        const num = pageNumber();
        setCurrentPage(list[num]);
    });

    async function nextChapter() {
        if (chapterIdx < volume.chapter_count - 1) {
            chapterIdx++;
        } else if (volumeIdx < series!.volumes!.length - 1) {
            volumeIdx++;
            chapterIdx = 0;
        } else {
            // TODO: show a "No more volumes or chapters" screen
            return;
        }
        
        volume = series!.volumes![volumeIdx];
        chapter = volume.chapters[chapterIdx];

        navigate(`/read/${series!.title}/${volume.title}/${chapter.title}`);
        
        const pages: Page[] = await getChapterPages(chapter?.handle);
        pages.sort((a, b) => a.name.localeCompare(b.name));
        setPageList(pages);
        setPageNumber(0);
        setCurrentPage(pageList()[pageNumber()]);
    }

    async function prevChapter() {
        if (chapterIdx > 0) {
            chapterIdx--;
        } else if (volumeIdx > 0) {
            volumeIdx--;
            
            volume = series!.volumes![volumeIdx];
            chapterIdx = volume.chapter_count - 1;
        } else {
            // TODO: show a "No previous chapters" screen
            return;
        }
        
        chapter = volume.chapters[chapterIdx];

        navigate(`/read/${series!.title}/${volume.title}/${chapter.title}`);
        
        const pages: Page[] = await getChapterPages(chapter?.handle);
        pages.sort((a, b) => a.name.localeCompare(b.name));
        setPageList(pages);
        setPageNumber(pages.length - 1);
        setCurrentPage(pageList()[pageNumber()]);
    }

    function nextPage() {
        if (pageNumber() === pageList().length - 1) {
            nextChapter();
            return;
        }
        
        setPageNumber((last) => Math.min(last + 1, pageList().length - 1));
    }

    function prevPage() {
        if (pageNumber() === 0) {
            prevChapter();
            return;
        }
        
        setPageNumber((last) => Math.max(last - 1, 0));
    }
    
    function firstPage() {
        setPageNumber(0);
    }

    function lastPage() {
        setPageNumber(pageList().length - 1);
    }

    function resetTransform() {
        setPageScale(1);
        setPageTranslation(Point.zero());
    }
    
    return {
        pageList,
        pageNumber,
        currentPage,

        nextPage,
        prevPage,
        firstPage,
        lastPage,

        pageScale,
        pageTranslation,

        setPageScale,
        setPageTranslation,

        resetTransform,

        ocrActive,
        setOcrActive,
    };
}
