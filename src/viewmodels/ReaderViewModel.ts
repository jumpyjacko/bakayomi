import { createSignal, onMount } from "solid-js";
import { useParams } from "@solidjs/router";

import { isTauri } from "@tauri-apps/api/core";

import { verifyPermission } from "../platform/fs.web";
import { getItem } from "../db/db";
import { Volume } from "../models/Volume";
import { Library } from "../models/Library";
import { Series } from "../models/Series";
import { getChapterPages } from "../platform/fs";

export function createReaderViewModel() {
    const params = useParams();

    const [loaded, setLoaded] = createSignal(false);
    const [pageList, setPageList] = createSignal([]);

    onMount(async () => {
        const tauri = isTauri();

        if (!tauri) {
            const libraryHandle = await getItem<Library>("library_handle", "root");
            await verifyPermission(libraryHandle.handle);
        }

        const series = await getItem<Series>(
            "library",
            decodeURIComponent(params.title),
        );

        if (series && series.volumes.length === 1) {
            const chapterName = decodeURIComponent(params.chapter);
            
            const volume: Volume = series.volumes[0];
            const chapter = volume.chapters.find(
                (ch) => ch.title === chapterName,
            );

            if (chapter === undefined) {
                // TODO: handle no chapters
            }
            
            const pages = await getChapterPages(chapter.handle);

            pages.sort((a, b) => a.name.localeCompare(b.name));

            setPageList(pages);
            setLoaded(true);
        }
    });

    return {
        loaded,
        pageList,
    };
}
