import { useNavigate } from "@solidjs/router";

import { refreshLibrary } from "../models/Library";

export default function HomeView() {
    const navigate = useNavigate();

    async function handleLibraryRequest() {
        await refreshLibrary();
    }

    return (
        <div class="flex flex-col min-h-screen justify-center items-center bg-surface text-text">
            <h1 class="font-bold">bakayomi (tbd) - the manga reader for idiots</h1>
            <h2 class="p-5">I don't know enough about machine learning to make OCR work</h2>
            <div class="flex flex-row flex-wrap gap-2">
                <button onClick={() =>
                    navigate("/library")
                }
                    class="bg-primary rounded-2xl p-1.5 hover:bg-primary-dimmed tr transition-colors text-primary-faded"
                >
                    Go to library
                </button>
                <button onClick={() =>
                    navigate("/read")
                }
                    class="bg-primary rounded-2xl p-1.5 hover:bg-primary-dimmed tr transition-colors text-primary-faded"
                >
                    Go to reader
                </button>
                <button onClick={handleLibraryRequest}>
                test fs
                </button>
                
                <button onClick={() => navigate("/read/Zeikin%20de%20Katta%20Hon/Chapter%201")}>
                test chapter loading
                </button>
            </div>
        </div>
    )
}
