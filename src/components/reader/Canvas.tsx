import { createEffect, onCleanup, onMount } from "solid-js";

export default function Canvas(props) {
    let imageRef!: HTMLImageElement;
    let canvasRef!: HTMLCanvasElement;

    let scale: number = 1;
    
    function setupCanvas() {
        const ratio = window.devicePixelRatio || 1;
        const ctx = canvasRef.getContext("2d");
        
        canvasRef.width = canvasRef.clientWidth * ratio;
        canvasRef.height = canvasRef.clientHeight * ratio;
        
        if (ctx) {
            ctx.scale(ratio, ratio);
        }
    }

    function drawImage() {
        const ctx = canvasRef.getContext("2d");
        ctx?.clearRect(0, 0, canvasRef.width, canvasRef.height);

        ctx?.drawImage(imageRef, 0, 0, imageRef.width * scale, imageRef.height * scale);
    }

    createEffect(() => {
        imageRef.src = props.src;

        imageRef.onload = () => {
            drawImage();
        }
    })

    onMount(() => {
        setupCanvas();
        
        window.addEventListener("resize", setupCanvas);
        window.addEventListener("resize", drawImage);

        const wheelHandler = (e: WheelEvent) => {
            e.preventDefault();
            const factor = e.deltaY < 0 ? 1.1 : 0.9;

            scale *= factor;
            drawImage();
        };
        window.addEventListener("wheel", wheelHandler, { passive: false });

        
        onCleanup(() => {
            window.removeEventListener("resize", setupCanvas);
            window.removeEventListener("resize", drawImage);

            window.removeEventListener("wheel", wheelHandler);
        });
    });
    
    return (
        <>
        <canvas ref={canvasRef} class="absolute w-screen h-screen block top-0 left-0 z-0" />
        <img ref={imageRef} src={props.src} class="hidden max-h-screen" />
        </>
    );
}
