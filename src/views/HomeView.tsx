import { createHomeViewModel } from "../viewmodels/HomeViewModel";

import Banner from "../components/Banner";
import { searchMangaSeriesById, searchMangaSeriesByName } from "../clients/AniList";
import { For } from "solid-js";
import Carousel from "../components/Carousel";
import { refreshLibrary } from "../models/Library";

export default function HomeView() {
    const vm = createHomeViewModel();
    
    return (
        <div class="flex flex-col bg-surface text-text">
            <Banner />
            <button onclick={() => {
                searchMangaSeriesByName("Tonari no Neko to Koi Shirazu");
            }} textContent="test anilist request"/>
            <button onclick={refreshLibrary} textContent="get fs" />
            <For each={vm.carousels()}>
                {(carousel) => <Carousel title={carousel.title} entries={carousel.entries} />}
            </For>
        </div>
    )
}
