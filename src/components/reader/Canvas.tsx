import { createEffect, onCleanup, onMount } from "solid-js";
import { Point } from "../../utils/point";

export default function Canvas(props) {
    let canvas!: HTMLCanvasElement;
    let cCtx!: CanvasRenderingContext2D;
    let overlayCanvas!: HTMLCanvasElement;
    let oCtx!: CanvasRenderingContext2D;
    let image!: HTMLImageElement;

    let isMouseDown: boolean = false;
    
    const mDownPos: Point = Point.zero();
    const mUpPos: Point = Point.zero();
    const mInterPos: Point = Point.zero();

    let lastTranslation: Point = Point.zero();
    
    let ratio: number = 1;
    function setupCanvas() {
        ratio = window.devicePixelRatio || 1;
        cCtx = canvas.getContext("2d", { willReadFrequently: true });
        
        canvas.width = canvas.clientWidth * ratio;
        canvas.height = canvas.clientHeight * ratio;
        
        if (cCtx) {
            cCtx.imageSmoothingEnabled = true;
            cCtx.imageSmoothingQuality = 'high';
        }
    }

    function setupOverlayCanvas() {
        oCtx = overlayCanvas.getContext("2d");
        overlayCanvas.width = overlayCanvas.clientWidth;
        overlayCanvas.height = overlayCanvas.clientHeight;
        oCtx?.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    }

    function drawImage() {
        cCtx?.clearRect(0, 0, canvas.width, canvas.height);

        const canvasCenter: Point = new Point(canvas.width, canvas.height).scale(1 / (2 * ratio));
        const imageCenter: Point = new Point(image.clientWidth, image.clientHeight).scale(1 / 2);
        
        const imageSize: Point = new Point(image.clientWidth, image.clientHeight).scale(props.vm.pageScale()).scale(ratio);
        let imagePos = canvasCenter.subtract(imageCenter).add(props.vm.pageTranslation()).scale(ratio);

        cCtx?.drawImage(image, imagePos.x, imagePos.y, imageSize.x, imageSize.y);
    }

    function drawIntermediarySelectionArea() {
        oCtx?.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        
        let s = mDownPos;
        let d = mInterPos.subtract(mDownPos);

        oCtx.strokeStyle = "rgb(107, 179, 255)";
        oCtx?.strokeRect(s.x, s.y, d.x, d.y);
    }

    function drawFinalSelectionArea() {
        oCtx?.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        
        let s = mDownPos;
        let d = mUpPos.subtract(mDownPos);

        oCtx.fillStyle = "rgba(107, 179, 255, 0.2)";
        oCtx.fillRect(s.x, s.y, d.x, d.y);
        oCtx.strokeStyle = "rgb(107, 179, 255)";
        oCtx?.strokeRect(s.x, s.y, d.x, d.y);

        props.vm.setOcrActive(false);

        captureSelectionArea(s, d);
    }

    async function captureSelectionArea(start: Point, dimensions: Point) {
        const s: Point = start.scale(ratio);
        const d: Point = dimensions.scale(ratio);

        console.log(s, d);

        const capture = cCtx?.getImageData(s.x, s.y, d.x, d.y);

        const offscreen = new OffscreenCanvas(Math.abs(d.x), Math.abs(d.y));
        const offCtx = offscreen.getContext("2d");

        offCtx?.putImageData(capture, 0, 0);

        const blob = await offscreen.convertToBlob();
        
        const url = URL.createObjectURL(blob);
        console.log(url);

        return blob;
    }

    createEffect(() => {
        image.src = props.src

        props.vm.pageScale();
        props.vm.pageTranslation();
        
        image.onload = () => {
            drawImage();
            setupOverlayCanvas();
        }
    });

    onMount(() => {
        setupCanvas();
        setupOverlayCanvas();
        
        window.addEventListener("resize", setupCanvas);
        window.addEventListener("resize", setupOverlayCanvas);
        window.addEventListener("resize", drawImage);

        // NOTE: Mouse event handlers
        const wheelHandler = (e: WheelEvent) => {
            e.preventDefault();
            const factor = e.deltaY < 0 ? 1.05 : 0.95;

            props.vm.setPageScale((last: number) => last * factor);
        };

        const mouseDown = (e: MouseEvent) => {
            if (e.button === 2) {
                return;
            }
            
            isMouseDown = true;
            
            lastTranslation = Object.assign({}, props.vm.pageTranslation());
            
            mDownPos.x = e.clientX;
            mDownPos.y = e.clientY;
        };

        const mouseMove = (e: MouseEvent) => {
            if (isMouseDown) {
                if (props.vm.ocrActive()) {
                    mInterPos.x = e.clientX;
                    mInterPos.y = e.clientY;
                    drawIntermediarySelectionArea();
                    return;
                }
                
                props.vm.setPageTranslation(new Point(e.clientX - (mDownPos.x - lastTranslation.x), e.clientY - (mDownPos.y - lastTranslation.y)));

                drawImage();
            }
        }

        const mouseUp = (e: MouseEvent) => {
            isMouseDown = false;
            mUpPos.x = e.clientX;
            mUpPos.y = e.clientY;

            if (e.target !== canvas) return;

            if (mDownPos.distance(mUpPos) < 5) {
                if (e.clientX * ratio < canvas.width / 2) {
                    props.vm.nextPage();
                } else {
                    props.vm.prevPage();
                }
            }

            if (props.vm.ocrActive()) {
                drawFinalSelectionArea();
            }
        };
        
        window.addEventListener("wheel", wheelHandler, { passive: false });
        window.addEventListener("mousedown", mouseDown);
        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseup", mouseUp);

        // NOTE: Touch event handlers
        const touchStart = (e: TouchEvent) => {
            e.preventDefault();

            isMouseDown = true;

            lastTranslation = Object.assign({}, props.vm.pageTranslation());
            
            mDownPos.x = e.touches.item(0)!.clientX;
            mDownPos.y = e.touches.item(0)!.clientY;
        };
        
        const touchMove = (e: TouchEvent) => {
            e.preventDefault();

            if (isMouseDown && props.vm.pageScale() !== 1) {
                let touchPos: Point = new Point(e.touches.item(0)!.clientX, e.touches.item(0)!.clientY);
                
                if (props.vm.ocrActive()) {
                    mInterPos.x = e.touches.item(0)!.clientX;
                    mInterPos.y = e.touches.item(0)!.clientY;
                    drawIntermediarySelectionArea();
                    return;
                }
                
                props.vm.setPageTranslation(new Point(touchPos.x - (mDownPos.x - lastTranslation.x), touchPos.y - (mDownPos.y - lastTranslation.y)));

                drawImage();
            }
        };
        
        window.addEventListener("touchstart", touchStart);
        window.addEventListener("touchmove", touchMove, { passive: false });
        
        onCleanup(() => {
            window.removeEventListener("resize", setupCanvas);
            window.removeEventListener("resize", drawImage);

            window.removeEventListener("wheel", wheelHandler);
            window.removeEventListener("mousedown", mouseDown);
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseup", mouseUp);

            window.removeEventListener("touchstart", touchStart);
            window.removeEventListener("touchmove", touchMove);
        });
    });
    
    return (
        <>
        <canvas ref={overlayCanvas} class="absolute pointer-events-none w-full h-full md:w-screen md:h-screen block top-0 left-0 z-10" />
        <canvas ref={canvas} class="absolute w-full h-full md:w-screen md:h-screen block top-0 left-0 z-0" />
        <img ref={image} class="invisible w-auto h-auto max-w-full max-h-full md:max-w-screen md:max-h-screen" />
        </>
    );
}
