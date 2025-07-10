import { useLocation, useNavigate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";

import { MdiSpinner, OcBookmark3, OcBookmarkfill3, OcGear3, OcHome3, OcHomefill3, OcPackagedependencies3, OcSearch3, OcStar3, OcStarfill3 } from "../assets/icons";
import { softRefreshLibrary } from "../platform/fs";

export default function HomeViewWrapper(props) {
    const navigate = useNavigate();
    const location = useLocation();

    const [refreshing, setRefreshing] = createSignal(false);

    return (
        <div class="
        flex w-screen
        flex-col-reverse
        md:flex-row
        ">
            <div class="
            fixed flex justify-between *:p-[16px] bottom-0 left-0 bg-surface text-text *:select-none
            flex-row h-[58px] *:h-full w-screen z-50
            md:static md:flex-col md:w-[58px] md:*:w-full md:*:h-full md:h-screen 
            ">
                {/* Top Section */}
                <div class="typo-ml-subtitle flex-1">
                <button onclick={() => navigate("/")} aria-label="Home">
                バカ
                </button>
                </div>
                
                {/* Middle Section */}
                <div class="
                flex items-center justify-center flex-1 *:p-[16px]
                flex-row
                md:flex-col
                ">
                <button onclick={() => navigate("/")} aria-label="Home">
                <Show when={location.pathname === "/"} fallback={<OcHome3 />}>
                    <OcHomefill3 />
                </Show>
                </button>
                
                <button onclick={() => navigate("/library")} aria-label="Library">
                <Show when={location.pathname === "/library"} fallback={<OcBookmark3 />}>
                    <OcBookmarkfill3 />
                </Show>
                </button>
                
                <button onclick={() => navigate("/browse")} aria-label="Browse">
                <OcSearch3 />
                </button>
                </div>
                
                {/* Bottom Section */}
                <div class="
                flex items-center justify-end *:p-[6px]
                flex-1
                md:flex-col
                ">
                <button onclick={async () => await softRefreshLibrary(setRefreshing)} aria-label="Import Local">
                <Show when={refreshing()} fallback={<OcPackagedependencies3 />}>
                    <MdiSpinner />
                </Show>
                </button>
                
                <button onclick={() => navigate("/updates")} aria-label="Updates">
                <Show when={location.pathname === "/updates"} fallback={<OcStar3 />}>
                    <OcStarfill3 />
                </Show>
                </button>
                
                <button onclick={() => navigate("/settings")} aria-label="Settings">
                <Show when={location.pathname === "/settings"} fallback={<OcGear3 />}>
                    <OcGear3 /> {/* Figure out a way to get this be filled*/}
                </Show>
                </button>
                </div>
            </div>
            <div class="flex-1 min-w-0">
                {props.children}
            </div>
        </div>
    );
}
