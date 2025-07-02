import { createSignal, onMount } from "solid-js";
import { getAllItems } from "../db/db";
import { Series } from "../models/Series";
import { searchMangaSeriesByName } from "../clients/AniList";

export function createHomeViewModel() {
    const [carousels, setCarousels] = createSignal([]); // NOTE: Purely data
    
    async function createLocalLibraryCarousel() {
        const library: Series[] = await getAllItems<Series>("library");

        for (let series of library) {
            if (series.al_id) {
                continue;
            }

            searchMangaSeriesByName(series.title)
                .then(updateSeries)
                .catch(handleError);
            
            async function updateSeries(data) {
                console.log(data);
                
                const res = data.data.Media;
                series.al_id = res.id;
                series.author = res.staff.nodes[0]; // TODO: change this to handle multiple authors
                series.description = res.description;
                series.original_lang = res.countryOfOrigin;
                series.status = res.status;
                series.covers.push({ name: "AniList Cover", cover_image: res.coverImage.extraLarge})
            }

            async function handleError(error) {
                console.log(error);
            }
        }
    }

    // onMount(async () => createLocalLibraryCarousel());
    
    return {
        carousels
    };
}
