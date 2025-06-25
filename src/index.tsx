/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import HomeView from "./views/HomeView";
import ReaderView from "./views/ReaderView";
import HomeViewWrapper from "./views/HomeViewWrapper";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
    );
}

render(() => {
    return (
        <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Router>
            <Route path="/" component={HomeViewWrapper}>
                <Route path="/" component={HomeView} />
            </Route>
            <Route path="/read/:title/:chapter" component={ReaderView} />
        </Router>
        </>
    );
},
root!);
