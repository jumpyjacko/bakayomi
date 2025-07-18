import { createSignal, For, onCleanup, onMount } from "solid-js";
import MangaVerticalCard from "./MangaVerticalCard";

export default function Carousel(props: any) {
    const BATCH_SIZE = 7;
    const [visibleCount, setVisibleCount] = createSignal(BATCH_SIZE);
    const visibleEntries = () => props.entries.slice(0, visibleCount());
    
    let sentinelRef: HTMLDivElement;

    onMount(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, props.entries.length));
            }
        });

        if (sentinelRef) {
            observer.observe(sentinelRef);
        }

        onCleanup(() => {
            observer.disconnect();
        })
    })
    
    return (
        <div class="mt-10">
            <h1 class="typo-heading ml-[12px]">{props.title}</h1>
            <div class="flex flex-row overflow-x-auto">
            <For each={visibleEntries()} fallback={<div class="ml-[12px]">Loading...</div>}>
            {(card) => (
                <MangaVerticalCard series={card}/>
            )}
            </For>
            <div ref={sentinelRef} class="w-1 shrink-0">
            </div>
            </div>
        </div>
    );
}
