import { getCurrentWindow } from "@tauri-apps/api/window";

export default function Titlebar() {
    const appWindow = getCurrentWindow();
    
    return (
        <>
        <div data-tauri-drag-region class="
        h-[24px] w-screen select-none flex justify-end fixed t-0 l-0 r-0
        text-text
        *:bg-surface *:transition-colors *:select-none
        *:w-[24px] *:h-[24px] *:inline-flex *:justify-center *:items-center
        ">
            <button class="titlebar-button hover:bg-primary-dimmed" onclick={appWindow.minimize}>
                <svg role="img" aria-label="minimize" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="16px" fill="currentColor"><path d="M240-120v-80h480v80H240Z" /></svg>
            </button>
            <button class="titlebar-button hover:bg-primary-dimmed" onclick={appWindow.maximize}>
                <svg role="img" aria-label="maximize" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="16px" fill="currentColor"><path d="M80-160v-640h800v640H80Zm80-80h640v-480H160v480Zm0 0v-480 480Z"/></svg>
            </button>
            <button class="titlebar-button hover:bg-secondary" onclick={appWindow.close}>
                <svg role="img" aria-label="close" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="16px" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
            </button>
        </div>
        </>
    );
}
