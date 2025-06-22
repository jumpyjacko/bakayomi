import { useNavigate } from "@solidjs/router";
import { requestLibraryFolderAccess } from "../platform/fs";

import { Series } from "../models/Series";
import { addItem, getAllItems } from "../db/db";

export default function HomeView() {
    const navigate = useNavigate();

    async function handleLibraryRequest() {
        try {
            const library: Series[] = await getAllItems<Series>("library");

            if (library.length === 0) {
                throw new Error("Database is empty");
            }
            
            console.log("Found existing library in indexedDB");
        } catch (err) {
            console.log("Didn't find existing library in indexedDB, creating...");
            
            const library: Series[] = await requestLibraryFolderAccess();

            for (const series of library) {
                addItem<Series>("library", series)
                    .then(result => {
                        console.log("Added series to indexedDB under 'library' store");
                    })
                    .catch(error => {
                        console.error("Failed to add series to indexedDB under 'library' store: ", error);
                    });
            }
        }
    }

    return (
        <div class="flex flex-col min-h-screen justify-center items-center">
            <h1 class="font-bold">bakayomi (tbd) - the manga reader for idiots</h1>
            <h2 class="p-5">I don't know enough about machine learning to make OCR work</h2>
            <div class="flex flex-row flex-wrap gap-2">
                <button onClick={() =>
                    navigate("/library")
                }
                    class="bg-blue-200 rounded-2xl p-1.5 hover:bg-blue-400 tr transition-colors"
                >
                    Go to library
                </button>
                <button onClick={() =>
                    navigate("/read")
                }
                    class="bg-blue-200 rounded-2xl p-1.5 hover:bg-blue-400 tr transition-colors"
                >
                    Go to reader
                </button>
                <button onClick={handleLibraryRequest}>
                test fs
                </button>
            </div>
        </div>
    )
}
