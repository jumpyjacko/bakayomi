import { createEffect, onCleanup, onMount } from "solid-js";
import { Point } from "../../utils/point";

export default function Canvas(props) {
    let canvas!: HTMLCanvasElement;
    let image!: HTMLImageElement;

    let scale: number = 1;
    let translateX: number = 0;
    let translateY: number = 0;
    
    function setupCanvas() {
        const ratio = window.devicePixelRatio || 1;
        const ctx = canvas.getContext("2d");
        
        canvas.width = canvas.clientWidth * ratio;
        canvas.height = canvas.clientHeight * ratio;
        
        if (ctx) {
            ctx.scale(ratio, ratio);
        }
    }

    function drawImage() {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        const canvasCenter: Point = new Point(canvas.width / 2, canvas.height / 2);
        const imageCenter: Point = new Point(image.width / 2, image.height / 2);
        
        const imageSize: Point = new Point(image.clientWidth * scale, image.clientHeight * scale);
        const imagePos = canvasCenter.subtract(imageCenter);

        ctx?.drawImage(image, imagePos.x, imagePos.y, imageSize.x, imageSize.y);
    }

    createEffect(() => {
        image.src = props.src

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
        <canvas ref={canvas} class="absolute w-screen h-screen block top-0 left-0 z-0" />
        <img ref={image} class="invisible w-auto h-auto max-w-screen max-h-screen" />
        </>
    );
}
