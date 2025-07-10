import { Show } from "solid-js";
import { createSeriesViewModel } from "../viewmodels/SeriesViewModel"
import IconButton from "../components/IconButton";
import { MdiLanguage, OcBook3, OcBookmark3, OcShareandroid3, SiAniList, SiMyAnimeList } from "../assets/icons";
import { convertAniListStatus, convertLngToType } from "../utils/utils";
import i18next from "i18next";

export default function SeriesView() {
    const vm = createSeriesViewModel();
    
    return (
        <div class="text-text min-h-screen w-full flex flex-col xl:flex-row" style={{ "view-transition-name": "main-content"}}>
        <Show when={vm.series()}>
            <div class="flex flex-col xl:w-2/3">
                <div class="flex flex-row mx-4 md:mx-16 mt-[116px] gap-[16px]">
                    <div class="
                    hidden md:flex flex-row flex-shrink-0
                    items-center justify-start overflow-hidden shadow-2
                    w-[340px] h-[490px] md:rounded-[8px]
                    ">
                        <img class="h-full flex-1 self-center overflow-hidden" src={vm.cover()} />
                    </div>
                    <div class="flex flex-col">
                        <div class="typo-title flex flex-col h-[4.5em] justify-end pb-4">
                            <h1 class="line-clamp-3 break-all typo-title md:break-keep hypens-auto">
                            {vm.series().title}
                            </h1>
                            <h2 class="typo-body md:typo-heading line-clamp-1">
                            {vm.series().staff.join(", ")}
                            </h2>
                        </div>
                        
                        <div class="flex flex-row flex-wrap gap-[6px]">
                            <IconButton icon={OcBookmark3} />
                            <IconButton icon={OcBook3} text="Start Reading" />
                            <IconButton icon={OcShareandroid3} invert={true} />
                            <IconButton icon={MdiLanguage} invert={true} />
                            <IconButton icon={SiAniList} invert={true} action={vm.aniListClick} />
                            <IconButton icon={SiMyAnimeList} invert={true} action={vm.malClick}/>
                        </div>
                        
                        <div class="hidden md:flex flex-row flex-wrap gap-[16px] typo-subtitle py-4">
                            <p>
                            {convertLngToType(vm.series().original_lang)}
                            </p>
                            <p>
                            {i18next.t("chapterWithCount", {count: vm.series().chapter_count})}
                            </p>
                            <p>
                            {i18next.t("series_v:published")} {vm.series().start_year} - {vm.series().end_year ? vm.series().end_year : "?"}
                            </p>
                            <p>
                            {convertAniListStatus(vm.series()?.status)}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col w-full items-center justify-center px-8 md:px-16 pt-8">
                    <h1 class="typo-heading">
                    {i18next.t("series_v:description")}
                    </h1>
                    <p class="whitespace-pre-line">
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
                <img class="h-full w-full object-cover" src={vm.series().banner ? vm.series().banner : vm.cover()} />
            </div>
        </Show>
        </div>
    )
}
