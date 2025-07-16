import { createEffect, onCleanup, onMount } from "solid-js";
import { Point } from "../../utils/point";

export default function Canvas(props) {
    let canvas!: HTMLCanvasElement;
    let image!: HTMLImageElement;

    let isMouseDown: boolean = false;
    
    let mDownPos: Point = new Point(0, 0);
    let mUpPos: Point = new Point(0, 0);
    
    let scale: number = 1;
    let translation: Point = new Point(0, 0);
    let lastTranslation: Point = new Point(0, 0);

    function setupCanvas() {
        const ratio = window.devicePixelRatio || 1;
        const ctx = canvas.getContext("2d");
        
        canvas.width = canvas.clientWidth * ratio;
        canvas.height = canvas.clientHeight * ratio;
        
        if (ctx) {
            ctx.scale(ratio, ratio);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
        }
    }

    function drawImage() {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        const canvasCenter: Point = new Point(canvas.width / 2, canvas.height / 2);
        const imageCenter: Point = new Point(image.clientWidth / 2, image.clientHeight / 2);
        
        const imageSize: Point = new Point(image.clientWidth * scale, image.clientHeight * scale);
        let imagePos = canvasCenter.subtract(imageCenter).add(translation);

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

        const mouseDown = (e: MouseEvent) => {
            if (e.button === 2) {
                return;
            }
            
            isMouseDown = true;
            
            lastTranslation = Object.assign({}, translation);
            
            mDownPos.x = e.clientX;
            mDownPos.y = e.clientY;

            // mDownPos = mDownPos.subtract(lastTranslation);
        };

        const mouseMove = (e: MouseEvent) => {
            if (isMouseDown) {
                translation.x = e.clientX - (mDownPos.x - lastTranslation.x);
                translation.y = e.clientY - (mDownPos.y - lastTranslation.y);

                drawImage();
            }
        }

        const mouseUp = (e: MouseEvent) => {
            isMouseDown = false;
            mUpPos.x = e.clientX;
            mUpPos.y = e.clientY;

            if (e.target !== canvas) return;

            if (mDownPos.distance(mUpPos) < 5) {
                if (e.clientX < canvas.width / 2) {
                    props.vm.nextPage();
                } else {
                    props.vm.prevPage();
                }
            }
        };
        
        window.addEventListener("wheel", wheelHandler, { passive: false });
        window.addEventListener("mousedown", mouseDown);
        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseup", mouseUp);
        
        onCleanup(() => {
            window.removeEventListener("resize", setupCanvas);
            window.removeEventListener("resize", drawImage);

            window.removeEventListener("wheel", wheelHandler);
            window.removeEventListener("mousedown", mouseDown);
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseup", mouseUp);
        });
    });
    
    return (
        <>
        <canvas ref={canvas} class="absolute w-screen h-screen block top-0 left-0 z-0" />
        <img ref={image} class="invisible w-auto h-auto max-w-screen max-h-screen" />
        </>
    );
}
