import { Show } from "solid-js";
import { createSeriesViewModel } from "../viewmodels/SeriesViewModel"

export default function SeriesView() {
    const vm = createSeriesViewModel();
    
    return (
        <div class="text-text min-h-screen w-full flex md:flex-row" style={{ "view-transition-name": "main-content"}}>
        <Show when={vm.series()}>
            <div class="flex flex-col">
                <div class="flex flex-row pl-20 pt-[116px] gap-[32px]">
                    <div class="
                    flex flex-row flex-shrink-0
                    items-center justify-start overflow-hidden shadow-2
                    w-[170px] h-[245px] rounded-[4px]
                    md:w-[340px] md:h-[490px] md:rounded-[8px]
                    ">
                        <img class="h-full flex-1 self-center overflow-hidden" src={vm.cover()} />
                    </div>
                    <div class="flex flex-col">
                        <h1 class="typo-title">
                        {vm.series().title}
                        </h1>
                        <h2 class="typo-heading">
                        {vm.series().staff.join(", ")}
                        </h2>
                    </div>
                    <div class="flex flex-row">
                    </div>
                </div>
            </div>
            <div class="flex flex-col">
            chapters
            </div>
            
            <div class="h-[300px] absolute top-0 w-full z-[-1]">
                <div class="hidden md:block md:absolute h-full md:w-2/3
                bg-gradient-to-r from-surface from-30% via-surface/60 via-75% to-transparent" />
                <div class="absolute bottom-0 h-full md:h-[30px] w-full mb-[-1px]
                bg-gradient-to-t from-surface via-surface/50 via-70% md:via-25% to-transparent
                " />
                <img class="h-full w-full object-cover" src={vm.series().banner} />
            </div>
        </Show>
        </div>
    )
}
