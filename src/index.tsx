/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { Navigate, Route, Router } from "@solidjs/router";

import HomeView from "./views/HomeView";
import ReaderView from "./views/ReaderView";

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
            <Route path="/" component={HomeView} />
            <Route path="/read/:title/:chapter" component={ReaderView} />
        </Router>
        </>
    );
},
root!);
