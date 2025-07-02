import { For } from "solid-js";
import MangaVerticalCard from "./MangaVerticalCard";

export default function Carousel(props: any) {
    return (
        <div>
            {props.title}
            <div class="flex flex-row overflow-x-auto">
                <For each={props.entries}>
                    {(card) => <MangaVerticalCard coverURI={card.coverURI} title={card.title} authors={card.authors} totalChapters={card.chapters} type={card.type}/>}
                </For>
            </div>
        </div>
    );
}
