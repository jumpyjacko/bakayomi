import { createSignal, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import { getItem } from "../db/db";
import { Series } from "../models/Series";

export function createSeriesViewModel() {
    const params = useParams();

    const [series, setSeries] = createSignal();

    onMount(async () => {
        const request = await getItem<Series>(
            "local_library",
            decodeURIComponent(params.title)
        );

        setSeries(request);

        console.log(request);
    });

    return {
       series 
    };
}
