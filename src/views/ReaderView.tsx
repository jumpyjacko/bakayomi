import { For, Show } from "solid-js";

import { createReaderViewModel } from "../viewmodels/ReaderViewModel";

export default function ReaderView() {
    const vm = createReaderViewModel();
    
    return (
        <>
        <div class="flex flex-col min-h-screen justify-center items-center">
        <Show when={vm.loaded} fallback="canvas goes here">
            <For each={vm.pageList()} fallback="loading...">
                {(item) =>
                    <img src={item.uri} />
                }
            </For>
        </Show>
        </div>
        </>
    )
}
