import { useNavigate, useParams } from "@solidjs/router";
import { OcArrowleft3, OcArrowright3, OcCrossreference3, OcHome3, OcMovetoend3, OcMovetostart3, OcScreenfull3, OcScreennormal3, OcSync3, OcZoomin3, OcZoomout3 } from "../../assets/icons";
import { createSignal, Show } from "solid-js";
import i18next from "i18next";

export default function Toolbar(props) {
    const params = useParams();
    const navigate = useNavigate();

    const [fullscreen, setFullscreen] = createSignal(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            try {
                document.documentElement.requestFullscreen();
                setFullscreen(true);
            } catch (err) {
                console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
            }
        } else {
            document.exitFullscreen();
            setFullscreen(false);
        }
    }
    
    function navigateBack() {
        navigate(`/series/${params.series}`);
    }
    
    return (
        <div class="
        flex flex-row md:flex-col gap-4
        absolute left-0 top-0 z-50
        md:w-8 m-2 p-2 rounded-[8px]
        items-center justify-center
        bg-surface text-text
        shadow-2
        ">
            <button onclick={navigateBack}>
                <OcHome3 />
            </button>
            <button onclick={toggleFullscreen}>
                <Show when={fullscreen()} fallback={<OcScreenfull3 />}>
                    <OcScreennormal3 />
                </Show>
            </button>
            <button onclick={() => props.vm.setPageScale((last: number) => last * 1.05)}>
                <OcZoomin3 />
            </button>
            <button onclick={props.vm.resetTransform} class="w-max text-xs overflow-ellipsis">
            {i18next.t("intlDecimal", { val: props.vm.pageScale()}) }x
            </button>
            <button onclick={() => props.vm.setPageScale((last: number) => last * 0.95)}>
                <OcZoomout3 />
            </button>
            <button onclick={props.vm.resetTransform}>
                <OcSync3 />
            </button>
            </Show>
            <button onclick={() => props.vm.setOcrActive(true)}>
                <OcCrossreference3 />
            </button>
            
            <div />
            
            <button onclick={props.vm.lastPage}>
                <OcMovetostart3 />
            </button>
            <button onclick={props.vm.nextPage}>
                <OcArrowleft3 />
            </button>
            <button onclick={props.vm.prevPage}>
                <OcArrowright3 />
            </button>
            <button onclick={props.vm.firstPage}>
                <OcMovetoend3 />
            </button>
        </div>
    );
}
