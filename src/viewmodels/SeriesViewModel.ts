import { createSignal, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import { getFromAllStores } from "../db/db";
import { Series } from "../models/Series";
import { toBlobUrl } from "../platform/fs";

export function createSeriesViewModel() {
    const params = useParams();

    const [series, setSeries] = createSignal();
    const [cover, setCover] = createSignal("");

    onMount(async () => {
        const request = await getFromAllStores<Series>(
            decodeURIComponent(params.title)
        );

        setSeries(request);
        
        const cover = request?.covers[0].cover_image;

        if (typeof(cover) === "string" && cover.startsWith("http")) {
            setCover(cover);
        } else {
            const coverUri = await toBlobUrl(cover)
                .catch(() => {
                    console.log("no permissions");
                });
            setCover(coverUri);
        }
    });

    const aniListClick = () => {
        window.open(series().al_link);
    }
    
    const malClick = () => {
        window.open(`https://myanimelist.net/manga/${series().mal_id}`);
    }

    return {
       series,
       cover,

       aniListClick,
       malClick,
    };
}
