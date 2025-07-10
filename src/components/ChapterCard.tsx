export default function ChapterCard(props) {
    return (
        <div class="
        w-full flex flex-row p-2 rounded-[8px]
        bg-surface text-text shadow-1
        ">
            <div class="flex flex-col flex-1">
            <h3 class="typo-body">
            {props.title}
            </h3>
            <p class="typo-thin">
            Local
            </p>
            </div>
            
            <div>
            
            </div>
        </div>
    )
}
