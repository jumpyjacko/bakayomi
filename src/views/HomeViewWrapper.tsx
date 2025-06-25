import { useLocation, useNavigate } from "@solidjs/router";
import { OcBookmark3, OcGear3, OcHome3, OcHomefill3, OcSearch3, OcStar3 } from "../assets/icons";
import { Show } from "solid-js";

export default function HomeViewWrapper(props) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div class="flex flex-row w-full">
            <div class="flex flex-col w-[58px] justify-between *:w-full *:p-[16px] bg-surface text-text">
                {/* Top Section */}
                <div class="typo-ml-subtitle">
                バカ
                </div>
                {/* Middle Section */}
                <div class="flex flex-col items-center justify-center gap-[32px]">
                <Show when={location.pathname === "/"} fallback={<OcHome3 />}>
                    <OcHomefill3 />
                </Show>
                <OcBookmark3 />
                <OcSearch3 />
                </div>
                {/* Bottom Section */}
                <div class="flex flex-col items-center justify-center gap-[16px]">
                <OcStar3 />
                <OcGear3 />
                </div>
            </div>
            <div class="flex-1">
                {props.children}
            </div>
        </div>
    );
}
