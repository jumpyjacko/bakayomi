import { useNavigate } from "@solidjs/router";

export default function Home() {
    const navigate = useNavigate();

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
            </div>
        </div>
    )
}
