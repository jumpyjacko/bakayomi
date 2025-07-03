import { createSignal, onMount } from "solid-js";
import { getAllItems } from "../db/db";
import { Series } from "../models/Series";
import { Carousel } from "../models/Carousel";

export function createHomeViewModel() {
    const [carousels, setCarousels] = createSignal<Carousel[]>([]); // NOTE: Purely data
    const [library, setLibrary] = createSignal<Series[]>([]);
    
    async function createLocalLibraryCarousel() { // TODO: URGENT, need to make carousels reactive
        setCarousels(list => [...list, { title: "Local", entries: library() }]);
    }

    onMount(async () => {
        const library: Series[] = await getAllItems<Series>("local_library");
        setLibrary(library);
        
        createLocalLibraryCarousel();
    });
    
    return {
        carousels
    };
}
