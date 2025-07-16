import { For, Show } from "solid-js";

import { createReaderViewModel } from "../viewmodels/ReaderViewModel";
import Canvas from "../components/reader/Canvas";
import Toolbar from "../components/reader/Toolbar";

export default function ReaderView() {
    const vm = createReaderViewModel();

    return (
        <>
        <div class="flex flex-col min-h-screen justify-center items-center">
            <Toolbar vm={vm} />
            <Show when={vm.currentPage()}>
                <Canvas src={vm.currentPage()?.uri} vm={vm} />
                <div class="absolute bottom-0 text-white text-lg text-border">
                {vm.pageNumber() + 1}/{vm.pageList().length}
                </div>
            </Show>
        </div>
        <style>
        {`
        .text-border {
            text-shadow: 
                1px 1px 0 black, 
                -1px -1px 0 black,
                1px -1px 0 black,
                -1px 1px black;
        }
        `}
        </style>
        </>
    );
}
