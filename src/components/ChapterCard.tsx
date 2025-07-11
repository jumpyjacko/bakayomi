import { useNavigate } from "@solidjs/router"

export default function ChapterCard(props) {
    const navigate = useNavigate();
    
    return (
        <button onclick={() => navigate(`/read/${encodeURIComponent(props.seriesTitle)}/${encodeURIComponent(props.volumeTitle)}/${encodeURIComponent(props.chapterTitle)}`)}
        class="
        w-full flex flex-row p-2 rounded-[8px]
        bg-surface text-text shadow-1
        ">
            <div class="flex flex-col flex-1 items-start">
            <h3 class="typo-body">
            {props.chapterTitle}
            </h3>
            <p class="typo-thin">
            Local
            </p>
            </div>
            
            <div>
            
            </div>
        </button>
    )
}
