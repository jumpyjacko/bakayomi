import { createEffect, createSignal, Show } from "solid-js";
import { MdiLanguage, OcBook3, OcBookmark3, OcShareandroid3 } from "../assets/icons";
import IconButton from "./IconButton";
import TextButton from "./TextButton";
import { Series } from "../models/Series";

export default function Banner(props: any) {
    const [currentBanner, setCurrentBanner] = createSignal<Series>();
    const [chapters, setChapters] = createSignal(0);

    createEffect(() => {
        const series = props.series()[0];
        setCurrentBanner(series);
    });
    
    return (
        <div class="h-[300px] relative">
            <Show when={currentBanner()}>
            <div class="
            flex flex-col relative top-0 z-1 pl-[25px] pt-[25px] pr-[10%] gap-[8px] mt-8
            md:mt-0 md:w-1/2 xl:w-1/3">
                <h1 class="typo-title line-clamp-2">
                {currentBanner().title}
                </h1>
                <p class="typo-body">
                {currentBanner().staff.join(", ")}
                </p>
                <div class="flex flex-row gap-[12px]">
                    <p class="typo-subtitle">
                    {currentBanner().type}
                    </p>
                    <p class="typo-subtitle">
                    {chapters()} Chapters
                    </p>
                    <p class="typo-subtitle">
                    Publishing
                    </p>
                </div>
                <p class="typo-body text-wrap line-clamp-2 md:line-clamp-4">
                {currentBanner().description}
                </p>
                
                <div class="absolute top-[280px] flex flex-row flex-nowrap gap-x-[6px]">
                <IconButton icon={OcBookmark3} />
                <IconButton icon={OcBook3} text="Start Reading" />
                <TextButton text="View Details" />
                <IconButton class="hidden md:block" icon={OcShareandroid3} invert={() => true} />
                <IconButton icon={MdiLanguage} invert={() => true} />
                </div>
            </div>
            <div class="absolute top-0 left-0 w-full h-[100px] md:h-[300px] md:overflow-clip">
                <div class="hidden md:block md:absolute h-full md:w-1/2 xl:w-1/3
                bg-gradient-to-r from-surface from-10% via-surface/80 via-60% to-transparent" />
                <div class="absolute bottom-0 h-3/4 md:h-[30px] w-full mb-[-1px]
                bg-gradient-to-t from-surface via-surface/75 via-50% md:via-25% to-transparent
                " />
                <img class="h-full w-full object-cover" src={currentBanner().banner} />
            </div>
            </Show>
        </div>
    )
}
