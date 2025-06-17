export default function ReaderView() {
    return (
        <>
        <div class="flex flex-col min-h-screen justify-center items-center">
        canvas goes here
        </div>

        <style>
        {`
            ::-webkit-scrollbar {
                display: none;
            }

            * {
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
        `}
        </style>
        </>
    )
}
