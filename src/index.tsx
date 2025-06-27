/* @refresh reload */
import "./index.css";
import { lazy, Show } from "solid-js";
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import { isTauri } from "@tauri-apps/api/core";
const Titlebar = isTauri() ? lazy(() => import("./components/Titlebar")) : null;

import HomeView from "./views/HomeView";
import ReaderView from "./views/ReaderView";
import HomeViewWrapper from "./views/HomeViewWrapper";
import LibraryView from "./views/LibraryView";
import BrowseView from "./views/BrowseView";
import UpdatesView from "./views/UpdatesView";
import SettingsView from "./views/SettingsView";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
    );
}

const isDark =
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
     window.matchMedia("(prefers-color-scheme: dark)").matches);

document.documentElement.classList.toggle("dark", isDark);

const themeColorMeta = document.querySelector('meta[name="theme-color"]');
if (themeColorMeta) {
    themeColorMeta.setAttribute("content", isDark ? "#19191b" : "#ffffff");
}

render(() => {
    return (
        <>
        <Show when={Titlebar && (localStorage.useTitlebar === "true" || !("useTitlebar" in localStorage))}>
            <Titlebar />
        </Show>
        <Router>
        <Route path="/" component={HomeViewWrapper}>
            <Route path="/" component={HomeView} />
            <Route path="/library" component={LibraryView} />
            <Route path="/browse" component={BrowseView} />
            <Route path="/updates" component={UpdatesView} />
            <Route path="/settings" component={SettingsView} />
        </Route>
        <Route path="/read/:title/:chapter" component={ReaderView} />
        </Router>
        </>
    );
}, root!);
