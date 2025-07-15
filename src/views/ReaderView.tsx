import { For, Show } from "solid-js";

import { createReaderViewModel } from "../viewmodels/ReaderViewModel";
import Canvas from "../components/reader/Canvas";

export default function ReaderView() {
    const vm = createReaderViewModel();
    
    return (
        <>
        <div class="flex flex-col min-h-screen justify-center items-center">
        <Show when={vm.currentPage()}>
            <Canvas src={vm.currentPage()?.uri} />
        </Show>
        </div>
        </>
    )
}
