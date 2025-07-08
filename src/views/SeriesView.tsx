import { Show } from "solid-js";
import { createSeriesViewModel } from "../viewmodels/SeriesViewModel"
import IconButton from "../components/IconButton";
import { MdiLanguage, OcBook3, OcBookmark3, OcShareandroid3, SiAniList, SiMyAnimeList } from "../assets/icons";
import { convertAniListStatus } from "../utils/utils";

export default function SeriesView() {
    const vm = createSeriesViewModel();
    
    return (
        <div class="text-text min-h-screen w-full flex flex-col xl:flex-row" style={{ "view-transition-name": "main-content"}}>
        <Show when={vm.series()}>
            <div class="flex flex-col xl:w-2/3">
                <div class="flex flex-row w-full pl-8 md:pl-16 pt-[116px] gap-[16px]">
                    <div class="
                    flex flex-row flex-shrink-0
                    items-center justify-start overflow-hidden shadow-2
                    w-[170px] h-[245px] rounded-[4px]
                    md:w-[340px] md:h-[490px] md:rounded-[8px]
                    ">
                        <img class="h-full flex-1 self-center overflow-hidden" src={vm.cover()} />
                    </div>
                    <div class="flex flex-col">
                        <div class="typo-title h-[4.7em]">
                            <h1 class="line-clamp-3">
                            {vm.series().title}
                            </h1>
                            <h2 class="typo-heading line-clamp-1">
                            {vm.series().staff.join(", ")}
                            </h2>
                        </div>
                        
                        <div class="flex flex-row flex-wrap gap-[6px]">
                            <IconButton icon={OcBookmark3} />
                            <IconButton icon={OcBook3} text="Start Reading" />
                            <IconButton icon={OcShareandroid3} invert={() => true} />
                            <IconButton icon={MdiLanguage} invert={() => true} />
                            <IconButton icon={SiAniList} invert={() => true} />
                            <IconButton icon={SiMyAnimeList} invert={() => true} />
                        </div>
                        
                        
                        <div class="flex flex-row flex-wrap gap-[16px] typo-subtitle py-4">
                            <p>
                            {vm.series().type}
                            </p>
                            <p>
                            {vm.series().chapter_count} Chapters
                            </p>
                            <p>
                            Published {vm.series().start_year} - {vm.series().end_year ? vm.series().end_year : "?"}
                            </p>
                            <p>
                            {convertAniListStatus(vm.series()?.status)}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col w-full items-center justify-center px-8 md:px-16 pt-8">
                    <h1 class="typo-heading">
                    Synopsis
                    </h1>
                    <p>
                    {vm.series().description}
                    </p>
                </div>
            </div>
            <div class="flex flex-col">
            chapters
            </div>
            
            <div class="h-[300px] absolute top-0 w-full z-[-1]">
                <div class="hidden md:block md:absolute h-full md:w-1/3 xl:w-2/3
                bg-gradient-to-r from-surface xl:from-30% via-surface/60 via-75% to-transparent" />
                <div class="absolute bottom-0 h-full xl:h-[30px] w-full mb-[-1px]
                bg-gradient-to-t from-surface via-surface/50 via-70% xl:via-25% to-transparent
                " />
                <img class="h-full w-full object-cover" src={vm.series().banner} />
            </div>
        </Show>
        </div>
    )
}
