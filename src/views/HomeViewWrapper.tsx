import { useLocation, useNavigate } from "@solidjs/router";
import { Show } from "solid-js";

import { OcBookmark3, OcGear3, OcHome3, OcHomefill3, OcSearch3, OcStar3 } from "../assets/icons";

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
                バカ
                </div>
                {/* Middle Section */}
                <div class="
                flex items-center justify-center gap-[32px] flex-1
                flex-row
                md:flex-col md:h-full
                ">
                <Show when={location.pathname === "/"} fallback={<OcHome3 />}>
                    <OcHomefill3 />
                </Show>
                <OcBookmark3 />
                <OcSearch3 />
                </div>
                {/* Bottom Section */}
                <div class="
                flex items-center justify-end gap-[16px]
                flex-1
                md:flex-col
                ">
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
