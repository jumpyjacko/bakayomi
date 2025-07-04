import { createSignal, onMount } from "solid-js";
import { addItem, clearStore, getAllItems } from "../db/db";
import { Series } from "../models/Series";
import { Carousel } from "../models/Carousel";
import { getTrendingSeries } from "../clients/AniList";
import { shuffleArray } from "../utils/utils";

export function createHomeViewModel() {
    const [carousels, setCarousels] = createSignal<Carousel[]>([]);
    const [bannerSeries, setBannerSeries] = createSignal<Series[]>([]);
    
    const [library, setLibrary] = createSignal<Series[]>([]);
    
    async function createLocalLibraryCarousel() { // TODO: URGENT, need to make carousels reactive
        setCarousels(list => [...list, { title: "Local", entries: library() }]);
    }

    onMount(async () => {
        const library: Series[] = await getAllItems<Series>("local_library");
        setLibrary(library);
        createLocalLibraryCarousel();


        function shouldUpdateBannerStore(): boolean {
            const storedTimestamp = localStorage.getItem("last_banner_fetch");
            if (!storedTimestamp) {
                localStorage.setItem("last_banner_fetch", Date.now().toString());
                return true;
            }

            const lastTime = parseInt(storedTimestamp, 10);
            const now = Date.now();

            const oneDay = 86400000;

            if (now - lastTime >= oneDay) {
                localStorage.setItem("last_banner_fetch", now.toString());
                return true;
            }

            return false;
        }
        
        if (shouldUpdateBannerStore()) {
            await clearStore("banner_series");
            const trendingSeries = await getTrendingSeries();

            const VALID_STAFF_OCCUPATIONS = ["Mangaka", "Writer", "Illustrator", "Artist"];
            for (const res of trendingSeries.data.Page.media) {
                let series: Series = {
                    title: res.title.userPreferred,
                    staff: [],
                    covers: [],
                    description: res.description,
                    status: res.status,
                    original_lang: res.countryOfOrigin,
                    banner: res.bannerImage,
                    
                    al_rating: res.averageScore,
                    al_id: res.id,
                }

                series.original_lang = res.countryOfOrigin;
                switch (series.original_lang) {
                    case "JP":
                        series.type = "Manga";
                    break;
                    case "KR":
                        series.type = "Manhwa";
                    break;
                    case "CN":
                        series.type = "Manhua";
                    break;
                    default:
                        series.type = "Unknown";
                }

                for (const staff of res.staff.nodes) {
                    if (res.staff.nodes.length === 1) {
                        series.staff.push(staff.name.full);
                    }

                    for (const occupation of staff.primaryOccupations) {
                        if (VALID_STAFF_OCCUPATIONS.includes(occupation)) {
                            series.staff.push(staff.name.full);
                        }
                    }
                }

                series.covers.push({ name: "AniList Cover", cover_image: res.coverImage.extraLarge });
                
                addItem<Series>("banner_series", series);
            }
        }

        let banners = await getAllItems<Series>("banner_series");
        shuffleArray(banners);

        setBannerSeries(banners.slice(0, 5));
    });
    
    return {
        carousels,
        bannerSeries
    };
}
