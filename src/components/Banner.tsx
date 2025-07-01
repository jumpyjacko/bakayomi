export default function Banner(props) {
    return (
        <div class="h-[300px]">
            <div class="
            flex flex-col absolute top-0 z-50 pl-[25px] pt-[25px] pr-[10%] gap-[8px] mt-8 md:mt-0
            md:mt-0 md:w-1/2 xl:w-1/3">
                <h1 class="typo-title line-clamp-2">
                Tonari no Neko to Koi Shirazu
                </h1>
                <p class="typo-body">
                Akinoko
                </p>
                <div class="flex flex-row gap-[12px]">
                    <p class="typo-subtitle">
                    Manga
                    </p>
                    <p class="typo-subtitle">
                    21 Chapters
                    </p>
                    <p class="typo-subtitle">
                    Publishing
                    </p>
                </div>
                <p class="typo-body text-wrap line-clamp-4">
                Minato Seno’s high school life had just begun when his homeroom teacher requested his help with Nekozane, the cat-like chronic napper who sits next to him in class. Timid and socially anxious, Minato has never talked to her or even seen her face. But when he finally musters up the courage to wake Nekozane, she unexpectedly hugs him on the spot! Thus begins a sweet tale of two teens awkwardly stumbling into a new friendship, unaware that their feelings are slowly turning into something more!<br />(Source: Manga UP! Global)<br /><br /><i>Note: Originally self-published on Twitter, it was picked up for commercial publication with two volumes collecting the Twitter comics releasing on 2024-03-25 and 2024-04-25, with subsequent serialization in Big Gangan starting 2024-04-25.</i>
                </p>
            </div>
            <div class="relative w-full h-[100px] md:h-[300px] md:overflow-clip">
                <div class="hidden md:block md:absolute h-full md:w-1/2 xl:w-1/3
                bg-gradient-to-r from-surface from-10% via-surface/80 via-60% to-transparent" />
                <div class="absolute bottom-0 h-3/4 md:h-[30px] w-full
                bg-gradient-to-t from-surface via-surface/75 via-50% md:via-25% to-transparent
                " />
                <img class="h-full w-full object-cover" src="https://s4.anilist.co/file/anilistcdn/media/manga/banner/174790-gsKNVMaPpORb.jpg" />
            </div>
        </div>
    )
}
