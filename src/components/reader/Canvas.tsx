import { createEffect, onCleanup, onMount } from "solid-js";
import { Point } from "../../utils/point";

export default function Canvas(props) {
    let canvasRef!: HTMLCanvasElement;

    const image = new Image();

    let scale: number = 1;
    let translateX: number = 0;
    let translateY: number = 0;
    
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

        const canvasCenter: Point = new Point(canvasRef.width / 2, canvasRef.height / 2);
        const imageCenter: Point = new Point(image.width / 2, image.height / 2);

        const imagePos = canvasCenter.subtract(imageCenter);

        ctx?.drawImage(image, imagePos.x, imagePos.y, image.width * scale, image.height * scale);
    }

    createEffect(() => {
        image.src = props.src;

        image.onload = () => {
            drawImage();
        }
    })

    onMount(() => {
        setupCanvas();
        
        window.addEventListener("resize", setupCanvas);
        window.addEventListener("resize", drawImage);

        const wheelHandler = (e: WheelEvent) => {
            e.preventDefault();
            const factor = e.deltaY < 0 ? 1.05 : 0.95;

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
        </>
    );
}
