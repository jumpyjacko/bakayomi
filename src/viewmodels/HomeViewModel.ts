import { createSignal, For, onMount } from "solid-js";
import { getAllItems } from "../db/db";
import { Series } from "../models/Series";
import { Carousel } from "../models/Carousel";
import { AniListToLocalMetadata, refreshLibrary } from "../models/Library";

export function createHomeViewModel() {
    const [carousels, setCarousels] = createSignal<Carousel[]>([]); // NOTE: Purely data
    
    async function createLocalLibraryCarousel() {
        const library: Series[] = await getAllItems<Series>("library");

        setCarousels(list => [...list, { title: "Local", entries: library }]);
    }

    onMount(async () => {
        createLocalLibraryCarousel();
    });
    
    return {
        carousels
    };
}
