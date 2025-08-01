import { createEffect, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import i18next from "i18next";

import { Series } from "../models/Series";

import { MdiLanguage, MdiTrendingUp, OcBook3, OcBookmark3, OcShareandroid3 } from "../assets/icons";
import IconButton from "./IconButton";
import TextButton from "./TextButton";
import { convertAniListStatus, convertLngToType } from "../utils/utils";
import { toBlobUrl } from "../platform/fs";

export default function Banner(props: any) {
    const navigate = useNavigate();
    
    const [currentBanner, setCurrentBanner] = createSignal<Series>();
    const [bannerIndex, setBannerIndex] = createSignal(0);
    const [cover, setCover] = createSignal("");

    function incBanner() {
        setBannerIndex((prev) => (prev + 1) % 5);
    }
    
    let prevIndicatorRef: HTMLElement | null;
    let prevInd2Ref: HTMLElement | null;
    onMount(() => {
        const bannerInterval = setInterval(incBanner, 20000);

        onCleanup(() => {
            clearInterval(bannerInterval);
        });
    });

    createEffect(async () => {
        const series = props.series()[bannerIndex()];
        setCurrentBanner(series);
        
        const activeIndicatorRef = document.getElementById(`banner-${bannerIndex()}`);
        const activeInd2Ref = document.getElementById(`banner-track-${bannerIndex()}`);

        prevIndicatorRef?.classList.remove("w-10");
        prevInd2Ref?.classList.remove("duration-20000", "w-full", "ease-linear");
        activeIndicatorRef?.classList.add("w-10");
        activeInd2Ref?.classList.add("duration-20000", "w-full", "ease-linear");
        
        prevIndicatorRef = activeIndicatorRef;
        prevInd2Ref = activeInd2Ref;

        const cover = currentBanner().covers[0].cover_image;
        if (typeof(cover) === "string" && cover.startsWith("http")) {
            setCover(cover);
        } else {
            const coverUri = await toBlobUrl(cover)
                .catch(() => {
                    console.log("no permissions");
                });
            setCover(coverUri);
        }
    });

    const handleViewDetails = () => {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                navigate(`series/${encodeURIComponent(currentBanner()?.title)}`);
            });
        } else {
            navigate(`series/${encodeURIComponent(currentBanner()?.title)}`);
        }
    }
    
    return (
        <div class="h-[300px] relative">
            <Show when={currentBanner()}>
            <div class="
            flex flex-col relative top-0 z-1 pl-[25px] pt-[25px] pr-[10%] gap-[8px] mt-8
            md:mt-0 md:w-1/2 xl:w-1/3">
                <h1 class="typo-title line-clamp-2">
                {currentBanner().title}
                </h1>
                <p class="typo-body line-clamp-1">
                {currentBanner().staff.join(", ")}
                </p>
                <div class="flex flex-row gap-[12px] typo-subtitle">
                    <p>
                    {convertLngToType(currentBanner()?.original_lang)}
                    </p>
                    <p>
                    {convertAniListStatus(currentBanner()?.status)}
                    </p>
                    <p class="flex flex-row gap-1 items-center">
                    <MdiTrendingUp />{currentBanner()?.al_rating}%
                    </p>
                </div>
                <p class="typo-body text-wrap line-clamp-2 md:line-clamp-4">
                {currentBanner().description}
                </p>
                
                <div class="absolute bottom-[-60px] md:top-[260px] flex flex-row flex-nowrap gap-x-[6px]">
                <IconButton icon={OcBookmark3} />
                <IconButton icon={OcBook3} text={i18next.t("startReading")} />
                <TextButton text={i18next.t("details")} action={handleViewDetails} />
                <IconButton class="hidden md:block" icon={OcShareandroid3} invert={true} />
                <IconButton icon={MdiLanguage} invert={true} />
                </div>
            </div>
            <div class="absolute top-0 left-0 w-full h-[100px] md:h-[280px] md:overflow-clip">
                <div class="absolute top-0 md:top-auto md:bottom-0 right-0 z-10 p-3 flex flex-row gap-1">
                <For each={[...Array(5)]}>
                {(_, index) => ( 
                    <button onclick={() => setBannerIndex(index)} id={`banner-${index()}`} class="bg-surface/40 w-5 h-0.5 shadow-2 rounded-2xl transition-all overflow-clip duration-300">
                        <div id={`banner-track-${index()}`} class="w-0 h-full bg-text transition-all"/>
                    </button>
                )}
                </For>
                </div>
                
                <div class="hidden md:block md:absolute h-full md:w-1/2
                bg-gradient-to-r from-surface from-10% via-surface/60 via-75% to-transparent" />
                <div class="absolute bottom-0 h-3/4 md:h-[30px] w-full mb-[-1px]
                bg-gradient-to-t from-surface via-surface/50 via-50% md:via-25% to-transparent
                " />
                <img class="h-full w-full object-cover" src={currentBanner().banner ? currentBanner().banner : cover()} />
            </div>
            </Show>
        </div>
    )
}
