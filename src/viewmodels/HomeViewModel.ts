import { createSignal, onMount } from "solid-js";
import { addItem, clearStore, getAllItems } from "../db/db";
import { Series } from "../models/Series";
import { Carousel } from "../models/Carousel";
import { getTrendingSeries } from "../clients/AniList";
import { shuffleArray } from "../utils/utils";
import i18next from "i18next";

export function createHomeViewModel() {
    const [carousels, setCarousels] = createSignal<Carousel[]>([]);
    
    const [library, setLibrary] = createSignal<Series[]>([]);
    const [trendingSeries, setTrendingSeries] = createSignal<Series[]>([]);
    
    const [bannerSeries, setBannerSeries] = createSignal<Series[]>([]);
    
    async function createLocalLibraryCarousel() { // TODO: need to make carousels reactive
        setCarousels(list => [...list, { title: i18next.t("home_v:local"), entries: library() }]);
    }

    async function createALTrendingCarousel() {
        setCarousels(list => [...list, { title: i18next.t("home_v:trending"), entries: trendingSeries()}]);
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

            const eighteenHours = 64800000;

            if (now - lastTime >= eighteenHours) {
                localStorage.setItem("last_banner_fetch", now.toString());
                return true;
            }

            return false;
        }
        
        if (shouldUpdateBannerStore()) {
            await clearStore("trending_series");
            const trendingSeries = await getTrendingSeries();

            const VALID_STAFF_OCCUPATIONS = ["Mangaka", "Writer", "Illustrator", "Artist"];
            for (const res of trendingSeries.data.Page.media) {
                let series: Series = {
                    title: res.title.userPreferred,
                    staff: [],
                    covers: [],
                    description: res.description.replace(/<br\s*\/?>/gi, ''),
                    status: res.status,
                    original_lang: res.countryOfOrigin,
                    banner: res.bannerImage,

                    start_year: res.startDate.year,
                    end_year: res.endDate.year,
                    al_popularity: res.popularity,
                    
                    al_rating: res.averageScore,
                    al_id: res.id,
                    mal_id: res.idMal,
                    al_link: res.siteUrl,
                };

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

                series.covers.push({ name: "AniList Cover (XL)", cover_image: res.coverImage.extraLarge, local: false});
                series.covers.push({ name: "AniList Cover (LG)", cover_image: res.coverImage.large, local: false});
                series.covers.push({ name: "AniList Cover (MD)", cover_image: res.coverImage.medium, local: false});
                
                addItem<Series>("trending_series", series);
            }
        }

        let trending = await getAllItems<Series>("trending_series");
        setTrendingSeries([...trending]);
        createALTrendingCarousel();
        
        shuffleArray(trending);

        setBannerSeries(trending.slice(0, 5));

    });
    
    return {
        carousels,
        bannerSeries
    };
}
