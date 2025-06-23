import { useParams } from "@solidjs/router"
import { getItem } from "../db/db";
import { createSignal, For, onMount, Show } from "solid-js";

import { Series } from "../models/Series";
import { Volume } from "../models/Volume";
import { Library } from "../models/Library";

async function verifyPermission(handle, mode = 'read') {
    const options = { mode };

    let permission = await handle.queryPermission(options);
    if (permission === 'granted') return true;

    permission = await handle.requestPermission(options);
    return permission === 'granted';
}

export default function ReaderView() {
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
    
    return (
        <>
        <div class="flex flex-col min-h-screen justify-center items-center">
        <Show when={loaded} fallback="canvas goes here">
            <For each={pageList()} fallback="loading...">
                {(item) =>
                    <img src={item.url} />
                }
            </For>
        </Show>
        </div>

        <style>
        {`
            ::-webkit-scrollbar {
                display: none;
            }

            * {
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
        `}
        </style>
        </>
    )
}
