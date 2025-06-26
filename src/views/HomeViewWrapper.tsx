import { useLocation, useNavigate } from "@solidjs/router";
import { Show } from "solid-js";

import { OcBookmark3, OcBookmarkfill3, OcGear3, OcHome3, OcHomefill3, OcSearch3, OcStar3, OcStarfill3 } from "../assets/icons";

export default function HomeViewWrapper(props) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div class="
        flex w-full
        flex-col-reverse
        md:flex-row
        ">
            <div class="
            flex justify-between *:p-[16px] bg-surface text-text
            fixed flex-row h-[58px] *:h-full w-screen bottom-0
            md:static md:flex-col md:w-[58px] md:*:w-full md:*:h-full md:h-screen
            ">
                {/* Top Section */}
                <div class="typo-ml-subtitle flex-1">
                <button onclick={() => navigate("/")}>
                バカ
                </button>
                </div>
                
                {/* Middle Section */}
                <div class="
                flex items-center justify-center flex-1 *:p-[16px]
                flex-row
                md:flex-col md:h-full
                ">
                <button onclick={() => navigate("/")}>
                <Show when={location.pathname === "/"} fallback={<OcHome3 />}>
                    <OcHomefill3 />
                </Show>
                </button>
                
                <button onclick={() => navigate("/library")}>
                <Show when={location.pathname === "/library"} fallback={<OcBookmark3 />}>
                    <OcBookmarkfill3 />
                </Show>
                </button>
                
                <button onclick={() => navigate("/browse")}>
                <OcSearch3 />
                </button>
                </div>
                
                {/* Bottom Section */}
                <div class="
                flex items-center justify-end *:p-[8px]
                flex-1
                md:flex-col
                ">
                <button onclick={() => navigate("/updates")}>
                <Show when={location.pathname === "/updates"} fallback={<OcStar3 />}>
                    <OcStarfill3 />
                </Show>
                </button>
                
                <button onclick={() => navigate("/settings")}>
                <Show when={location.pathname === "/settings"} fallback={<OcGear3 />}>
                    <OcGear3 /> {/* Figure out a way to get this be filled*/}
                </Show>
                </button>
                </div>
            </div>
            <div class="flex-1">
                {props.children}
            </div>
        </div>
    );
}
