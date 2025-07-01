import { createHomeViewModel } from "../viewmodels/HomeViewModel";

import MangaVerticalCard from "../components/MangaVerticalCard";
import Banner from "../components/Banner";

export default function HomeView() {
    const vm = createHomeViewModel();
    
    return (
        <div class="flex flex-col bg-surface text-text">
            <Banner />
            <div class="flex flex-row overflow-x-auto pt-20">
                <MangaVerticalCard coverURI="https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx174790-7wZ1sDAhcofd.jpg" title="Tonari no Neko to Koi Shirazu" authors="Akinoko" totalChapters="38" type="Manga"/>
                <MangaVerticalCard coverURI="https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx174790-7wZ1sDAhcofd.jpg" title="Tonari no Neko to Koi Shirazu" authors="Akinoko" totalChapters="38" type="Manga"/>
                <MangaVerticalCard coverURI="https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx174790-7wZ1sDAhcofd.jpg" title="Tonari no Neko to Koi Shirazu" authors="Akinoko" totalChapters="38" type="Manga"/>
                <MangaVerticalCard coverURI="https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx174790-7wZ1sDAhcofd.jpg" title="Tonari no Neko to Koi Shirazu" authors="Akinoko" totalChapters="38" type="Manga"/>
            </div>
            <div class="flex flex-row overflow-x-auto">
                <MangaVerticalCard coverURI="https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx174790-7wZ1sDAhcofd.jpg" title="Tonari no Neko to Koi Shirazu" authors="Akinoko" totalChapters="38" type="Manga"/>
                <MangaVerticalCard coverURI="https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx174790-7wZ1sDAhcofd.jpg" title="Tonari no Neko to Koi Shirazu" authors="Akinoko" totalChapters="38" type="Manga"/>
                <MangaVerticalCard coverURI="https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx174790-7wZ1sDAhcofd.jpg" title="Tonari no Neko to Koi Shirazu" authors="Akinoko" totalChapters="38" type="Manga"/>
                <MangaVerticalCard coverURI="https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx174790-7wZ1sDAhcofd.jpg" title="Tonari no Neko to Koi Shirazu" authors="Akinoko" totalChapters="38" type="Manga"/>
            </div>
            <div class="flex flex-row overflow-x-auto">
                <MangaVerticalCard coverURI="https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx174790-7wZ1sDAhcofd.jpg" title="Tonari no Neko to Koi Shirazu" authors="Akinoko" totalChapters="38" type="Manga"/>
                <MangaVerticalCard coverURI="https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx174790-7wZ1sDAhcofd.jpg" title="Tonari no Neko to Koi Shirazu" authors="Akinoko" totalChapters="38" type="Manga"/>
                <MangaVerticalCard coverURI="https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx174790-7wZ1sDAhcofd.jpg" title="Tonari no Neko to Koi Shirazu" authors="Akinoko" totalChapters="38" type="Manga"/>
                <MangaVerticalCard coverURI="https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx174790-7wZ1sDAhcofd.jpg" title="Tonari no Neko to Koi Shirazu" authors="Akinoko" totalChapters="38" type="Manga"/>
            </div>
        </div>
    )
}
