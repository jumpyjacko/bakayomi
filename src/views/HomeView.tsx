import { createHomeViewModel } from "../viewmodels/HomeViewModel";

import Banner from "../components/Banner";
import { For } from "solid-js";
import Carousel from "../components/Carousel";

export default function HomeView() {
    const vm = createHomeViewModel();

    return (
        <div class="flex flex-col bg-surface text-text" style={{ "view-transition-name": "main-content"}}>
            <Banner series={vm.bannerSeries}/>
            <For each={vm.carousels()}>
                {(carousel) => <Carousel title={carousel.title} entries={carousel.entries} />}
            </For>
        </div>
    )
}
