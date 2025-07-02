import { createHomeViewModel } from "../viewmodels/HomeViewModel";

import Banner from "../components/Banner";
import { searchMangaSeries } from "../clients/AniList";

export default function HomeView() {
    const vm = createHomeViewModel();
    
    return (
        <div class="flex flex-col bg-surface text-text">
            <Banner />
            <button onclick={() => searchMangaSeries("Tonari no Neko to Koi Shirazu")} textContent="test anilist request"/>
        </div>
    )
}
