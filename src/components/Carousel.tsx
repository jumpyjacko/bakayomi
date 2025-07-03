import { For } from "solid-js";
import MangaVerticalCard from "./MangaVerticalCard";

export default function Carousel(props: any) {
    return (
        <div class="mt-10">
            <h1 class="typo-heading ml-[12px]">{props.title}</h1>
            <div class="flex flex-row overflow-x-auto">
            <For each={props.entries} fallback={<div class="ml-[12px]">Loading...</div>}>
            {(card) => (
                <MangaVerticalCard series={card}/>
            )}
            </For>
            </div>
        </div>
    );
}
