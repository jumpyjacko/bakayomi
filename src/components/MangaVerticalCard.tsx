import { createSignal, onMount } from "solid-js"
import { toBlobUrl } from "../platform/fs";

export default function MangaVerticalCard(props) {
    const [cover, setCover] = createSignal("");
    
    onMount(async () => {
        if (typeof(props.cover) === "object") {
            setCover(await toBlobUrl(props.cover));
        } else {
            setCover(props.cover);
        }
    })
    
    return (
        <div class="m-[12px] w-[170px] h-[340px] flex flex-col">
            <div class="
            w-[170px] h-[245px]
            flex flex-row flex-nowrap
            items-center justify-start overflow-hidden
            rounded-[4px]
            mb-[0.3rem]
            "
            style="box-shadow: 0px 0px 4px 0px #00000033;"
            >
                <img class="h-full flex-1 self-center overflow-hidden" src={cover()} />
            </div>
            
            <div class="w-full text-wrap typo-body overflow-ellipsis line-clamp-2">
            {props.title}
            </div>
            <div class="w-full flex-1 typo-thin line-clamp-1">
            {props.authors}
            </div>
            <div class="flex flex-row typo-subtitle">
                <div class="flex-1">
                {props.totalChapters} Chapters
                </div>
                <div class="w-fit">
                {props.type}
                </div>
            </div>
        </div>
    )
}
