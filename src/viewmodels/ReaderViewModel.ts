import { createSignal, onMount } from "solid-js";
import { useParams } from "@solidjs/router";

import { isTauri } from "@tauri-apps/api/core";

import { Volume } from "../models/Volume";
import { Library } from "../models/Library";
import { Series } from "../models/Series";
import { Page } from "../models/Page";

import { getChapterPages, verifyPermission } from "../platform/fs";
import { getItem } from "../db/db";

export function createReaderViewModel() {
    const params = useParams();

    const [pageList, setPageList] = createSignal<Page[]>([]);
    const [currentPage, setCurrentPage] = createSignal<Page>();

    onMount(async () => {
        const tauri = isTauri();

        if (!tauri) {
            const libraryHandle = await getItem<Library>("library_handle", "root");
            await verifyPermission(libraryHandle?.handle);
        }

        const seriesName = decodeURIComponent(params.series);
        const volumeName = decodeURIComponent(params.volume);
        const chapterName = decodeURIComponent(params.chapter);

        const series = await getItem<Series>("local_library", seriesName);
        const volume = series?.volumes?.find((v) => v.title === volumeName);
        const chapter = volume?.chapters.find((c) => c.title === chapterName);

        const pages: Page[] = await getChapterPages(chapter?.handle);
        pages.sort((a, b) => a.name.localeCompare(b.name));

        setPageList(pages);
        setCurrentPage(pageList()[0]);
    });

    return {
        pageList,
        currentPage,
    };
}
