import { createSignal, onMount } from "solid-js";
import { useParams } from "@solidjs/router";

import { isTauri } from "@tauri-apps/api/core";
import { basename } from "@tauri-apps/api/path";
import { readFile } from "@tauri-apps/plugin-fs";

import { verifyPermission } from "../platform/fs.web";
import { getItem } from "../db/db";
import { Volume } from "../models/Volume";
import { Library } from "../models/Library";
import { Series } from "../models/Series";

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
            const volume: Volume = series.volumes[0];
            const chapter = volume.chapters.find(
                (ch) => ch.title === decodeURIComponent(params.chapter),
            );

            const pages = [];

            if (chapter) {
                for (const page of chapter.pages) {
                    if (tauri) {
                        const path = page as string;
                        const file = await readFile(path);
                        const blob = new Blob([file], { type: "image/jpeg" });
                        const blobUrl = URL.createObjectURL(blob);

                        pages.push({ url: blobUrl, name: await basename(path) });
                    } else {
                        const file = await page.getFile();
                        const blob = new Blob([file], { type: "image/jpeg" });
                        const blobUrl = URL.createObjectURL(blob);

                        pages.push({ url: blobUrl, name: file.name });
                    }
                }
            } else {
                // TODO: handle chapter doesn't exist
            }

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
