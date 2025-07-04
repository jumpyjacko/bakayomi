import { createSignal, onMount } from "solid-js"
import { toBlobUrl } from "../platform/fs";

export default function MangaVerticalCard(props) {
    const [cover, setCover] = createSignal("");
    const [title, setTitle] = createSignal("");
    const [author, setAuthor] = createSignal("");
    const [chapters, setChapters] = createSignal(0);
    const [type, setType] = createSignal("");
    
    onMount(async () => {
        // const AniListCover = props.covers.find(c => c.name === "AniList Cover");
        const cover = props.series.covers[0].cover_image;

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
        setType(props.series.type);
        
        let chapterCount = 0;

        for (const vol of props.series.volumes) {
            chapterCount += vol.chapter_count;
        }
        setChapters(chapterCount);
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
            {title()}
            </div>
            <div class="w-full flex-1 typo-thin line-clamp-1">
            {author()}
            </div>
            <div class="flex flex-row typo-subtitle">
                <div class="flex-1">
                {chapters()} Chapters
                </div>
                <div class="w-fit">
                {type()}
                </div>
            </div>
        </div>
    )
}
