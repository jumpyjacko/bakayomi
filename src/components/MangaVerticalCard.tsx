import { createSignal, onMount } from "solid-js"
import { useNavigate } from "@solidjs/router";
import i18next from "i18next";

import { toBlobUrl } from "../platform/fs";
import { convertLngToType } from "../utils/utils";
import { Cover } from "../models/Cover";

export default function MangaVerticalCard(props) {
    const navigate = useNavigate();
    
    const [cover, setCover] = createSignal("");
    const [title, setTitle] = createSignal("");
    const [author, setAuthor] = createSignal("");
    const [chapters, setChapters] = createSignal(0);
    const [type, setType] = createSignal("");
    
    onMount(async () => {
        let cover;
        const localCovers: Cover[] = props.series.covers.filter((c) => c.local);
        if (localCovers.length === 0) {
            var find = props.series.covers.find((c) => c.name === "AniList Cover (LG)");
            cover = find?.cover_image;
        } else {
            cover = localCovers[0].cover_image; // TODO: make this user selectable
        }

        if (typeof(cover) === "string" && cover.startsWith("http")) {
            setCover(cover);
        } else {
            const coverUri = await toBlobUrl(cover)
                .catch(() => {
                    console.log("no permissions");
                });
            setCover(coverUri);
        }
        
        setTitle(props.series.title);
        setAuthor(props.series.staff.join(", "));
        setType(convertLngToType(props.series.original_lang));
        setChapters(props.series.chapter_count);
    })

    function navigateTo() {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                navigate(`series/${encodeURIComponent(title())}`);
            });
        } else {
            navigate(`series/${encodeURIComponent(title())}`);
        }
    }
    
    return (
        <button class="m-[12px] w-[170px] h-[340px] flex flex-col text-left" onclick={navigateTo}>
            <div class="
            w-[170px] h-[245px]
            flex flex-row
            items-center justify-start overflow-hidden
            rounded-[4px]
            mb-[0.3rem]
            "
            style="box-shadow: 0px 0px 4px 0px #00000033;"
            >
                <img class="h-full flex-1 self-center overflow-hidden" src={cover()} />
            </div>
            
            <div class="w-full text-wrap typo-body overflow-ellipsis line-clamp-2">
            {title()}
            </div>
            <div class="w-full flex-1 typo-thin line-clamp-1">
            {author()}
            </div>
            <div class="flex flex-row typo-subtitle w-full">
                <div class="flex-1">
                {i18next.t("chapterWithCount", {count: chapters() ? chapters() : 0})}
                </div>
                <div class="w-fit">
                {type()}
                </div>
            </div>
        </button>
    )
}
