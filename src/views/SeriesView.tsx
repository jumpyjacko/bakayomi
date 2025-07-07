import { Show } from "solid-js";
import { createSeriesViewModel } from "../viewmodels/SeriesViewModel"

export default function SeriesView() {
    const vm = createSeriesViewModel();
    
    return (
        <div class="text-text min-h-screen w-full flex md:flex-row" style={{ "view-transition-name": "main-content"}}>
        <Show when={vm.series()} fallback={
            <div class="flex justify-center items-center w-full h-screen">
                <h1 class="typo-heading">
                Series not found.
                </h1>
            </div>
        }>
            <div class="flex flex-row">
            series info
            </div>
            <div class="flex flex-col">
            chapters
            </div>
        </Show>
        </div>
    )
}
