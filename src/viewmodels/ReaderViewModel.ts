import { createSignal, onMount } from "solid-js";
import { getItem } from "../db/db";
import { Volume } from "../models/Volume";
import { verifyPermission } from "../platform/fs.web";
import { useParams } from "@solidjs/router";
import { Library } from "../models/Library";

export function createReaderViewModel() {
    const params = useParams();

    const [loaded, setLoaded] = createSignal(false);
    const [pageList, setPageList] = createSignal([]);

    onMount(async () => {
        try {
            const libraryHandle = await getItem<Library>("library_handle", "root");
            await verifyPermission(libraryHandle.handle);
            
            const series = await getItem("library", decodeURIComponent(params.title));

            if (series && series.volumes.length === 1) {
                const volume: Volume = series.volumes[0];

                const chapter = volume.chapters.find((ch) => ch.title === decodeURIComponent(params.chapter));
                
                const pages = [];
                
                if (chapter) {
                    for (const page of chapter.pages) {
                        const file = await page.getFile();

                        const blob = new Blob([file], { type: "image/jpeg" });
                        
                        const blobUrl = URL.createObjectURL(blob);
                        pages.push({ url: blobUrl, name: file.name });
                    }
                }

                pages.sort((a, b) => a.name.localeCompare(b.name));

                setPageList(pages);
                setLoaded(true);

                console.log(pageList());
            }
        } catch (err) {
            console.log(err);
        }
    })

    return {
        loaded,
        pageList
    };
}
