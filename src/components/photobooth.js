import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Webcam from "react-webcam";

/*
|--------------------------------------------------------------------------
| FRAME LIST
|--------------------------------------------------------------------------
|
| The folder name determines how many photos the frame needs.
|
| slot1 = 1 photo
| slot2 = 2 photos
| slot3 = 3 photos
| slot4 = 4 photos
| slot6 = 6 photos
|
| The actual size and position of each slot is detected automatically
| from the transparent areas of the PNG.
|
|--------------------------------------------------------------------------
*/

const frameOptions = [
    // 1 PHOTO
    { id: "f0", src: "assets/frames/slot1/f0.png", slotCount: 1 },
    { id: "f14", src: "assets/frames/slot1/f14.png", slotCount: 1 },
    { id: "f16", src: "assets/frames/slot1/f16.png", slotCount: 1 },
    { id: "f2", src: "assets/frames/slot1/f2.png", slotCount: 1 },
    { id: "f3", src: "assets/frames/slot1/f3.png", slotCount: 1 },
    { id: "f4", src: "assets/frames/slot1/f4.png", slotCount: 1 },
    { id: "f6", src: "assets/frames/slot1/f6.png", slotCount: 1 },
    { id: "f8", src: "assets/frames/slot1/f8.png", slotCount: 1 },
    { id: "bts1", src: "assets/frames/slot1/bts1.png", slotCount: 1 },
    { id: "bt21w", src: "assets/frames/slot1/bt21w.png", slotCount: 1 },
    { id: "bt21q", src: "assets/frames/slot1/bt21q.png", slotCount: 1 },
    { id: "bt21e", src: "assets/frames/slot1/bt21e.png", slotCount: 1 },
    { id: "bt21r", src: "assets/frames/slot1/bt21r.png", slotCount: 1 },
    { id: "bt21t", src: "assets/frames/slot1/bt21t.png", slotCount: 1 },
    { id: "bt21y", src: "assets/frames/slot1/bt21y.png", slotCount: 1 },
    { id: "bt21u", src: "assets/frames/slot1/bt21u.png", slotCount: 1 },

    // 2 PHOTOS
    { id: "f13", src: "assets/frames/slot2/f13.png", slotCount: 2 },

    // 3 PHOTOS
    { id: "f10", src: "assets/frames/slot3/f10.png", slotCount: 3 },
    { id: "f11", src: "assets/frames/slot3/f11.png", slotCount: 3 },
    { id: "f12", src: "assets/frames/slot3/f12.png", slotCount: 3 },
    { id: "f19", src: "assets/frames/slot3/f19.png", slotCount: 3 },

    // 4 PHOTOS
    { id: "f15", src: "assets/frames/slot4/f15.png", slotCount: 4 },
    { id: "f7", src: "assets/frames/slot4/f7.png", slotCount: 4 },
    { id: "f23", src: "assets/frames/slot4/f23.png", slotCount: 4 },
    { id: "cst", src: "assets/frames/slot4/cst.png", slotCount: 4 },
    { id: "f20", src: "assets/frames/slot4/f20.png", slotCount: 4 },
    { id: "f21", src: "assets/frames/slot4/f21.png", slotCount: 4 },
    { id: "f22", src: "assets/frames/slot4/f22.png", slotCount: 4 },

    // 6 PHOTOS
    { id: "f1", src: "assets/frames/slot6/f1.png", slotCount: 6 },
    { id: "f5", src: "assets/frames/slot6/f5.png", slotCount: 6 },
    { id: "f9", src: "assets/frames/slot6/f9.png", slotCount: 6 },

    // 9 PHOTOS
    { id: "cake", src: "assets/frames/slot6/cake.png", slotCount: 9 },
];

/*
|--------------------------------------------------------------------------
| STICKERS
|--------------------------------------------------------------------------
*/

const stickerOptions = [
    "assets/stickers/Xiao1.png",
    "assets/stickers/Xiao2.png",
    "assets/stickers/Xiao3.png",
    "assets/stickers/Xiao4.png",
    "assets/stickers/Xiao5.png",
    "assets/stickers/Xiao6.png",
    "assets/stickers/Xiao7.png",
    "assets/stickers/Xiao8.png",
    "assets/stickers/Xiao9.png",
    "assets/stickers/blackcat1.png",
    "assets/stickers/blackcat2.png",
    "assets/stickers/blackcat3.png",
    "assets/stickers/blackcat4.png",
    "assets/stickers/glits1.png",
    "assets/stickers/glits2.png",
    "assets/stickers/glits3.png",
    "assets/stickers/glits4.png",
    "assets/stickers/glits5.png",
    "assets/stickers/glits6.png",
    "assets/stickers/glits7.png",
    "assets/stickers/glits8.png",
    "assets/stickers/glits9.png",
    "assets/stickers/pokémon1.png",
    "assets/stickers/pokémon2.png",
    "assets/stickers/pokémon3.png",
    "assets/stickers/pokémon4.png",
    "assets/stickers/pokémon5.png",
    "assets/stickers/pokémon6.png",
    "assets/stickers/pokémon7.png",
    "assets/stickers/pokémon8.png",
    "assets/stickers/pokémon9.png",
    "assets/stickers/pokémon10.png",
    "assets/stickers/pokémon11.png",
    "assets/stickers/pokémon12.png",
    "assets/stickers/pokémon13.png",
    "assets/stickers/pokémon14.png",
    "assets/stickers/pokémon15.png",
    "assets/stickers/pokémon16.png",
    "assets/stickers/pokémon17.png",
];

/*
|--------------------------------------------------------------------------
| TEXT FONT OPTIONS
|--------------------------------------------------------------------------
*/

const textFontOptions = [
    {
        id: "cantika",
        name: "Cantika Cute",
        family: "CantikaCute"
    },
    {
        id: "playfair",
        name: "Playfair Display",
        family: "Playfair Display"
    },
    {
        id: "poppins",
        name: "Poppins",
        family: "Poppins"
    }
];

/*
|--------------------------------------------------------------------------
| RESPONSIVE BREAKPOINT HOOK
|--------------------------------------------------------------------------
|
| Tracks viewport width so layout, font sizes, thumbnails, canvas size
| and camera resolution can all react to the actual screen the booth is
| running on (desktop, tablet, or phone) instead of fixed pixel values.
|
|--------------------------------------------------------------------------
*/

function useViewportWidth() {
    const [width, setWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1024
    );

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener(
                "orientationchange",
                handleResize
            );
        };
    }, []);

    return width;
}

/*
|--------------------------------------------------------------------------
| PHOTO BOOTH
|--------------------------------------------------------------------------
*/

export default function PhotoBooth() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const frameImgRef = useRef(null);

    const viewportWidth = useViewportWidth();
    const isMobile = viewportWidth <= 768;
    const isSmallPhone = viewportWidth <= 380;

    const [selectedFrame, setSelectedFrame] = useState(null);
    const [selectedFrameConfig, setSelectedFrameConfig] = useState(null);
    const [detectedSlots, setDetectedSlots] = useState([]);
    const [mode, setMode] = useState("photo");
    const [photos, setPhotos] = useState([]);
    const [photoCount, setPhotoCount] = useState(0);
    const [canTakePhoto, setCanTakePhoto] = useState(true);
    const [draggingPhotoIndex, setDraggingPhotoIndex] = useState(null);
    const [draggingSticker, setDraggingSticker] = useState(null);
    const [draggingText, setDraggingText] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [countdown, setCountdown] = useState(null);

    const [stickers, setStickers] = useState([]);
    const [selectedSticker, setSelectedSticker] = useState(null);

    /*
    |----------------------------------------------------------------------
    | CUSTOM TEXT STATE
    |----------------------------------------------------------------------
    */

    const [textItems, setTextItems] = useState([]);
    const [selectedText, setSelectedText] = useState(null);

    const [newText, setNewText] = useState("");
    const [textFont, setTextFont] = useState("CantikaCute");
    const [textSize, setTextSize] = useState(50);
    const [textColor, setTextColor] = useState("#8c5b4a");
    const [textBold, setTextBold] = useState(false);
    const [textItalic, setTextItalic] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | RESPONSIVE STYLE VALUES
    |--------------------------------------------------------------------------
    |
    | These recompute whenever viewportWidth changes, instead of being
    | fixed constants, so the whole booth reflows on phones/tablets.
    |
    |--------------------------------------------------------------------------
    */

    const MAX_CANVAS_WIDTH = isSmallPhone
        ? Math.min(viewportWidth - 32, 320)
        : isMobile
        ? Math.min(viewportWidth - 48, 380)
        : 500;

    const MAX_CANVAS_HEIGHT = isMobile ? 520 : 650;

    const webcamColumnWidth = isSmallPhone
        ? Math.min(viewportWidth - 32, 320)
        : isMobile
        ? Math.min(viewportWidth - 48, 380)
        : 400;

    const frameThumbSize = isSmallPhone
        ? { width: 110, height: 146 }
        : isMobile
        ? { width: 140, height: 186 }
        : { width: 180, height: 240 };

    const stickerThumbSize = isSmallPhone ? 40 : isMobile ? 44 : 50;

    const styles = useMemo(
        () => ({
            centerCol: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: isMobile ? 12 : 20,
                width: "100%",
                boxSizing: "border-box",
                padding: isMobile ? "0 12px" : 0
            },

            topBar: {
                width: "100%",
                maxWidth: 700,
                minHeight: 60,
                position: "relative",
                marginBottom: isMobile ? 8 : 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                textAlign: "center"
            },

            buttonStyle: {
                padding: isMobile ? "8px 14px" : "10px 20px",
                fontSize: isMobile ? 16 : 20,
                cursor: "pointer",
                fontFamily: "CantikaCute",
                color: "#8c5b4a",
                border: "2px solid #8c5b4a",
                borderRadius: 8,
                background: "white",
                touchAction: "manipulation"
            },

            frameThumb: {
                ...frameThumbSize,
                objectFit: "contain",
                cursor: "pointer",
                borderRadius: 12,
                boxShadow: "0 8px 8px rgba(0,0,0,0.15)"
            },

            titleBar: {
                margin: 0,
                lineHeight: isMobile ? "1.3" : "60px",
                textAlign: "center",
                width: "100%",
                fontSize: isSmallPhone ? "1rem" : isMobile ? "1.15rem" : "1.5rem",
                padding: isMobile ? "10px 0" : 0
            },

            mainContent: {
                minHeight: isMobile ? "auto" : 600,
                width: "100%",
                maxWidth: 900,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                boxSizing: "border-box"
            },

            row: {
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 20 : 40,
                alignItems: isMobile ? "center" : "flex-start",
                width: "100%"
            }
        }),
        [isMobile, isSmallPhone, frameThumbSize]
    );

    /*
    |--------------------------------------------------------------------------
    | CAMERA CONSTRAINTS — MATCHED TO THE ACTIVE SLOT'S ASPECT RATIO
    |--------------------------------------------------------------------------
    |
    | Instead of a fixed 1920x1080 request, we derive an ideal aspect ratio
    | from the slot the next photo will land in, so the webcam frames the
    | shot the way it'll actually be cropped into the layout — this matters
    | a lot on phones, where the front camera is usually portrait-first.
    |
    |--------------------------------------------------------------------------
    */

    const activeSlot = detectedSlots[photoCount] || detectedSlots[0] || null;

    const slotAspectRatio = activeSlot
        ? activeSlot.width / activeSlot.height
        : isMobile
        ? 3 / 4
        : 4 / 3;

    const videoConstraints = useMemo(() => {
        const baseWidth = isMobile ? 720 : 1280;
        const idealHeight = Math.round(baseWidth / slotAspectRatio);

        return {
            width: { ideal: baseWidth },
            height: { ideal: idealHeight },
            aspectRatio: { ideal: slotAspectRatio },
            facingMode: "user"
        };
    }, [isMobile, slotAspectRatio]);

    /*
    |--------------------------------------------------------------------------
    | SELECT FRAME
    |--------------------------------------------------------------------------
    */

    const selectFrame = (frameConfig) => {
        setSelectedFrame(frameConfig.src);
        setSelectedFrameConfig(frameConfig);
        setPhotos([]);
        setPhotoCount(0);
        setStickers([]);
        setSelectedSticker(null);
        setTextItems([]);
        setSelectedText(null);
        setDetectedSlots([]);
        setMode("photo");
        setCanTakePhoto(true);
    };

    /*
    |--------------------------------------------------------------------------
    | AUTOMATIC SLOT DETECTION
    |--------------------------------------------------------------------------
    */

    const detectTransparentSlots = (image, expectedCount) => {
        const tempCanvas = document.createElement("canvas");

        tempCanvas.width = image.width;
        tempCanvas.height = image.height;

        const tempCtx = tempCanvas.getContext("2d", {
            willReadFrequently: true
        });

        tempCtx.drawImage(image, 0, 0);

        const imageData = tempCtx.getImageData(
            0,
            0,
            image.width,
            image.height
        );

        const pixels = imageData.data;
        const width = image.width;
        const height = image.height;

        const transparent = new Uint8Array(width * height);

        for (let i = 0; i < width * height; i++) {
            const alpha = pixels[i * 4 + 3];

            transparent[i] = alpha < 30 ? 1 : 0;
        }

        const visited = new Uint8Array(width * height);
        const components = [];

        const directions = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1]
        ];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = y * width + x;

                if (transparent[index] !== 1 || visited[index] === 1) {
                    continue;
                }

                const queue = [[x, y]];

                visited[index] = 1;

                let minX = x;
                let maxX = x;
                let minY = y;
                let maxY = y;
                let area = 0;
                let queueIndex = 0;

                while (queueIndex < queue.length) {
                    const [currentX, currentY] = queue[queueIndex++];

                    area++;

                    minX = Math.min(minX, currentX);
                    maxX = Math.max(maxX, currentX);
                    minY = Math.min(minY, currentY);
                    maxY = Math.max(maxY, currentY);

                    for (const [dx, dy] of directions) {
                        const nx = currentX + dx;
                        const ny = currentY + dy;

                        if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
                            continue;
                        }

                        const nIndex = ny * width + nx;

                        if (
                            transparent[nIndex] === 1 &&
                            visited[nIndex] === 0
                        ) {
                            visited[nIndex] = 1;

                            queue.push([nx, ny]);
                        }
                    }
                }

                const componentWidth = maxX - minX + 1;
                const componentHeight = maxY - minY + 1;

                if (
                    area > 5000 &&
                    componentWidth > 50 &&
                    componentHeight > 50
                ) {
                    components.push({
                        x: minX,
                        y: minY,
                        width: componentWidth,
                        height: componentHeight,
                        area
                    });
                }
            }
        }

        let candidates = components.filter(
            (component) =>
                component.x > 1 &&
                component.y > 1 &&
                component.x + component.width < width - 1 &&
                component.y + component.height < height - 1
        );

        candidates.sort((a, b) => b.area - a.area);

        if (candidates.length > expectedCount) {
            candidates = candidates.slice(0, expectedCount);
        }

        candidates.sort((a, b) => {
            const rowTolerance = Math.min(a.height, b.height) * 0.4;

            if (Math.abs(a.y - b.y) > rowTolerance) {
                return a.y - b.y;
            }

            return a.x - b.x;
        });

        return candidates.map((slot, index) => ({
            ...slot,
            index
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | GET SLOT
    |--------------------------------------------------------------------------
    */

    const getSlotForPhoto = (photo) => {
        return detectedSlots[photo.slotIndex] || null;
    };

    /*
    |--------------------------------------------------------------------------
    | DRAW CANVAS
    |--------------------------------------------------------------------------
    */

    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const frame = frameImgRef.current;

        if (!canvas || !frame) {
            return;
        }

        const ctx = canvas.getContext("2d");

        canvas.width = frame.width;
        canvas.height = frame.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /*
        |----------------------------------------------------------------------
        | DRAW PHOTOS
        |----------------------------------------------------------------------
        */

        photos.forEach((photo) => {
            const slot = detectedSlots[photo.slotIndex] || null;

            if (!slot) {
                return;
            }

            const drawWidth = photo.img.width * photo.scale;
            const drawHeight = photo.img.height * photo.scale;

            const centerX = slot.x + slot.width / 2;
            const centerY = slot.y + slot.height / 2;

            const photoX = centerX - drawWidth / 2 + photo.offsetX;
            const photoY = centerY - drawHeight / 2 + photo.offsetY;

            ctx.save();

            ctx.beginPath();
            ctx.rect(slot.x, slot.y, slot.width, slot.height);
            ctx.clip();

            ctx.drawImage(photo.img, photoX, photoY, drawWidth, drawHeight);

            ctx.restore();
        });

        /*
        |----------------------------------------------------------------------
        | DRAW FRAME
        |----------------------------------------------------------------------
        */

        ctx.drawImage(frame, 0, 0, frame.width, frame.height);

        /*
        |----------------------------------------------------------------------
        | DRAW STICKERS
        |----------------------------------------------------------------------
        */

        stickers.forEach((sticker, index) => {
            if (!sticker.img) {
                return;
            }

            ctx.drawImage(
                sticker.img,
                sticker.x,
                sticker.y,
                sticker.width,
                sticker.height
            );

            if (index === selectedSticker) {
                ctx.strokeStyle = "#ff7aa2";
                ctx.lineWidth = 4;

                ctx.strokeRect(
                    sticker.x,
                    sticker.y,
                    sticker.width,
                    sticker.height
                );
            }
        });

        /*
        |----------------------------------------------------------------------
        | DRAW CUSTOM TEXT
        |----------------------------------------------------------------------
        */

        textItems.forEach((textItem, index) => {
            if (!textItem.text) {
                return;
            }

            const weight = textItem.bold ? "bold" : "normal";
            const style = textItem.italic ? "italic" : "normal";

            ctx.save();

            ctx.font = `${style} ${weight} ${textItem.size}px "${textItem.font}"`;
            ctx.fillStyle = textItem.color;
            ctx.textBaseline = "top";

            ctx.fillText(textItem.text, textItem.x, textItem.y);

            if (index === selectedText) {
                const metrics = ctx.measureText(textItem.text);
                const textWidth = metrics.width;
                const textHeight = textItem.size;

                ctx.strokeStyle = "#ff7aa2";
                ctx.lineWidth = 3;

                ctx.strokeRect(
                    textItem.x - 6,
                    textItem.y - 6,
                    textWidth + 12,
                    textHeight + 12
                );
            }

            ctx.restore();
        });
    }, [photos, stickers, textItems, selectedSticker, selectedText, detectedSlots]);

    /*
    |--------------------------------------------------------------------------
    | LOAD FRAME
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!selectedFrameConfig) {
            return;
        }

        const img = new Image();
        img.src = selectedFrameConfig.src;

        img.onload = () => {
            frameImgRef.current = img;

            const slots = detectTransparentSlots(
                img,
                selectedFrameConfig.slotCount
            );

            setDetectedSlots(slots);

            setTimeout(() => {
                drawCanvas();
            }, 0);
        };

        img.onerror = () => {
            console.error("Could not load frame:", selectedFrameConfig.src);
        };
        // drawCanvas intentionally omitted because this effect
        // should only run when the selected frame changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFrameConfig]);

    /*
    |--------------------------------------------------------------------------
    | REDRAW
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        drawCanvas();
        // drawCanvas intentionally omitted because its body is recreated
        // on render and the state dependencies below control when redraws occur.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photos, stickers, textItems, selectedSticker, selectedText, detectedSlots]);

    /*
    |--------------------------------------------------------------------------
    | DELETE STICKER / TEXT
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (
                (event.key === "Delete" || event.key === "Backspace") &&
                mode === "decorate"
            ) {
                if (selectedText !== null) {
                    setTextItems((previous) =>
                        previous.filter((_, index) => index !== selectedText)
                    );

                    setSelectedText(null);

                    return;
                }

                if (selectedSticker !== null) {
                    setStickers((previous) =>
                        previous.filter(
                            (_, index) => index !== selectedSticker
                        )
                    );

                    setSelectedSticker(null);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedSticker, selectedText, mode]);

    /*
    |--------------------------------------------------------------------------
    | BACK
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {
        if (mode === "decorate") {
            setMode("photo");
            setCanTakePhoto(false);
            setStickers([]);
            setSelectedSticker(null);
            setTextItems([]);
            setSelectedText(null);

            return;
        }

        setSelectedFrame(null);
        setSelectedFrameConfig(null);
        setDetectedSlots([]);
        setPhotos([]);
        setPhotoCount(0);
        setStickers([]);
        setSelectedSticker(null);
        setTextItems([]);
        setSelectedText(null);
        setMode("photo");
        setCanTakePhoto(true);
    };

    /*
    |--------------------------------------------------------------------------
    | ADD PHOTO
    |--------------------------------------------------------------------------
    */

    const addPhoto = (img) => {
        if (!selectedFrameConfig) {
            return;
        }

        const totalSlots = selectedFrameConfig.slotCount;

        if (photoCount >= totalSlots) {
            return;
        }

        const slot = detectedSlots[photoCount];

        if (!slot) {
            console.error("Slot was not detected:", photoCount);

            return;
        }

        const scaleX = slot.width / img.width;
        const scaleY = slot.height / img.height;

        const scale = Math.max(scaleX, scaleY);

        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;

        setPhotos((previous) => [
            ...previous,
            {
                img,
                slotIndex: photoCount,
                scale,
                offsetX: 0,
                offsetY: 0,
                drawWidth,
                drawHeight
            }
        ]);

        setPhotoCount((current) => {
            const next = current + 1;

            if (next >= totalSlots) {
                setMode("decorate");
                setCanTakePhoto(false);
            } else {
                setCanTakePhoto(true);
            }

            return next;
        });
    };

    /*
    |--------------------------------------------------------------------------
    | TAKE PHOTO
    |--------------------------------------------------------------------------
    */

    const takePhotoNow = () => {
        if (!webcamRef.current) {
            return;
        }

        const src = webcamRef.current.getScreenshot();

        if (!src) {
            return;
        }

        const img = new Image();

        img.src = src;

        img.onload = () => {
            addPhoto(img);
        };
    };

    /*
    |--------------------------------------------------------------------------
    | COUNTDOWN
    |--------------------------------------------------------------------------
    */

    const capturePhoto = () => {
        if (!canTakePhoto || countdown !== null) {
            return;
        }

        if (
            !selectedFrameConfig ||
            photoCount >= selectedFrameConfig.slotCount
        ) {
            return;
        }

        setCanTakePhoto(false);
        setCountdown(3);

        let current = 3;

        const interval = setInterval(() => {
            current--;

            if (current === 0) {
                clearInterval(interval);

                setCountdown(null);

                takePhotoNow();
            } else {
                setCountdown(current);
            }
        }, 1000);
    };

    /*
    |--------------------------------------------------------------------------
    | UPLOAD PHOTO
    |--------------------------------------------------------------------------
    */

    const uploadPhoto = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const img = new Image();

            img.src = reader.result;

            img.onload = () => {
                addPhoto(img);
            };
        };

        reader.readAsDataURL(file);

        event.target.value = "";
    };

    /*
    |--------------------------------------------------------------------------
    | REDO LAST PHOTO
    |--------------------------------------------------------------------------
    */

    const redoLastPhoto = () => {
        if (!photos.length) {
            return;
        }

        setPhotos((previous) => previous.slice(0, -1));

        setPhotoCount((current) => Math.max(0, current - 1));

        setCanTakePhoto(true);
        setMode("photo");
        setSelectedSticker(null);
        setSelectedText(null);
    };

    /*
    |--------------------------------------------------------------------------
    | POINTER COORDINATES (shared by mouse + touch)
    |--------------------------------------------------------------------------
    |
    | getCoords now takes a plain {clientX, clientY} pair instead of an
    | event, so the same math drives both mouse and touch interactions.
    |
    |--------------------------------------------------------------------------
    */

    const getCoords = (clientX, clientY) => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return { x: 0, y: 0 };
        }

        const rect = canvas.getBoundingClientRect();

        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    };

    const pointFromMouseEvent = (event) => ({
        clientX: event.clientX,
        clientY: event.clientY
    });

    const pointFromTouchEvent = (event) => {
        const touch = event.touches[0] || event.changedTouches[0];

        if (!touch) {
            return null;
        }

        return { clientX: touch.clientX, clientY: touch.clientY };
    };

    /*
    |--------------------------------------------------------------------------
    | POINTER DOWN (shared logic for mouse + touch)
    |--------------------------------------------------------------------------
    */

    const handlePointerDown = (clientX, clientY) => {
        const { x, y } = getCoords(clientX, clientY);

        /*
        |----------------------------------------------------------------------
        | PHOTO MODE
        |----------------------------------------------------------------------
        */

        if (mode === "photo") {
            for (let i = photos.length - 1; i >= 0; i--) {
                const photo = photos[i];
                const slot = getSlotForPhoto(photo);

                if (!slot) {
                    continue;
                }

                const drawWidth = photo.img.width * photo.scale;
                const drawHeight = photo.img.height * photo.scale;

                const photoX =
                    slot.x + (slot.width - drawWidth) / 2 + photo.offsetX;

                const photoY =
                    slot.y + (slot.height - drawHeight) / 2 + photo.offsetY;

                if (
                    x >= photoX &&
                    x <= photoX + drawWidth &&
                    y >= photoY &&
                    y <= photoY + drawHeight
                ) {
                    setDraggingPhotoIndex(i);

                    setDragOffset({
                        x: x - photoX,
                        y: y - photoY
                    });

                    return;
                }
            }
        }

        /*
        |----------------------------------------------------------------------
        | DECORATE MODE
        |----------------------------------------------------------------------
        */

        if (mode === "decorate") {
            /*
            |------------------------------------------------------------------
            | CHECK TEXT FIRST
            |------------------------------------------------------------------
            */

            for (let i = textItems.length - 1; i >= 0; i--) {
                const textItem = textItems[i];

                if (!textItem.text) {
                    continue;
                }

                const weight = textItem.bold ? "bold" : "normal";
                const style = textItem.italic ? "italic" : "normal";

                const ctx = canvasRef.current.getContext("2d");

                ctx.font = `${style} ${weight} ${textItem.size}px "${textItem.font}"`;

                const textWidth = ctx.measureText(textItem.text).width;
                const textHeight = textItem.size;

                if (
                    x >= textItem.x - 10 &&
                    x <= textItem.x + textWidth + 10 &&
                    y >= textItem.y - 10 &&
                    y <= textItem.y + textHeight + 10
                ) {
                    setDraggingText(i);
                    setSelectedText(i);
                    setSelectedSticker(null);

                    setDragOffset({
                        x: x - textItem.x,
                        y: y - textItem.y
                    });

                    return;
                }
            }

            /*
            |------------------------------------------------------------------
            | CHECK STICKERS
            |------------------------------------------------------------------
            */

            for (let i = stickers.length - 1; i >= 0; i--) {
                const sticker = stickers[i];

                if (
                    x >= sticker.x &&
                    x <= sticker.x + sticker.width &&
                    y >= sticker.y &&
                    y <= sticker.y + sticker.height
                ) {
                    setDraggingSticker(i);
                    setSelectedSticker(i);
                    setSelectedText(null);

                    setDragOffset({
                        x: x - sticker.x,
                        y: y - sticker.y
                    });

                    return;
                }
            }

            setSelectedSticker(null);
            setSelectedText(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | POINTER MOVE (shared logic for mouse + touch)
    |--------------------------------------------------------------------------
    */

    const handlePointerMove = (clientX, clientY) => {
        const { x, y } = getCoords(clientX, clientY);

        /*
        |----------------------------------------------------------------------
        | DRAG PHOTO
        |----------------------------------------------------------------------
        */

        if (draggingPhotoIndex !== null && mode === "photo") {
            setPhotos((previous) => {
                const updated = [...previous];
                const photo = updated[draggingPhotoIndex];

                if (!photo) {
                    return updated;
                }

                const slot = getSlotForPhoto(photo);

                if (!slot) {
                    return updated;
                }

                const drawWidth = photo.img.width * photo.scale;
                const drawHeight = photo.img.height * photo.scale;

                const centerX = slot.x + slot.width / 2;
                const centerY = slot.y + slot.height / 2;

                let newOffsetX =
                    x - dragOffset.x - (centerX - drawWidth / 2);

                let newOffsetY =
                    y - dragOffset.y - (centerY - drawHeight / 2);

                const maxOffsetX = Math.max(
                    0,
                    (drawWidth - slot.width) / 2
                );

                const maxOffsetY = Math.max(
                    0,
                    (drawHeight - slot.height) / 2
                );

                newOffsetX = Math.max(
                    -maxOffsetX,
                    Math.min(maxOffsetX, newOffsetX)
                );

                newOffsetY = Math.max(
                    -maxOffsetY,
                    Math.min(maxOffsetY, newOffsetY)
                );

                photo.offsetX = newOffsetX;
                photo.offsetY = newOffsetY;

                return updated;
            });
        }

        /*
        |----------------------------------------------------------------------
        | DRAG STICKER
        |----------------------------------------------------------------------
        */

        if (draggingSticker !== null && mode === "decorate") {
            setStickers((previous) => {
                const updated = [...previous];

                if (!updated[draggingSticker]) {
                    return updated;
                }

                updated[draggingSticker] = {
                    ...updated[draggingSticker],
                    x: x - dragOffset.x,
                    y: y - dragOffset.y
                };

                return updated;
            });
        }

        /*
        |----------------------------------------------------------------------
        | DRAG TEXT
        |----------------------------------------------------------------------
        */

        if (draggingText !== null && mode === "decorate") {
            setTextItems((previous) => {
                const updated = [...previous];

                if (!updated[draggingText]) {
                    return updated;
                }

                updated[draggingText] = {
                    ...updated[draggingText],
                    x: x - dragOffset.x,
                    y: y - dragOffset.y
                };

                return updated;
            });
        }
    };

    const handlePointerUp = () => {
        setDraggingPhotoIndex(null);
        setDraggingSticker(null);
        setDraggingText(null);
    };

    /*
    |--------------------------------------------------------------------------
    | MOUSE EVENT WRAPPERS
    |--------------------------------------------------------------------------
    */

    const handleMouseDown = (event) => {
        const point = pointFromMouseEvent(event);
        handlePointerDown(point.clientX, point.clientY);
    };

    const handleMouseMove = (event) => {
        const point = pointFromMouseEvent(event);
        handlePointerMove(point.clientX, point.clientY);
    };

    const handleMouseUp = () => {
        handlePointerUp();
    };

    /*
    |--------------------------------------------------------------------------
    | TOUCH EVENT WRAPPERS (phones/tablets)
    |--------------------------------------------------------------------------
    |
    | We call preventDefault only when we're actually acting on a drag, so
    | ordinary taps and page scroll elsewhere are left alone. touchAction:
    | "none" on the canvas element (see render) stops the browser from
    | trying to scroll/zoom while a drag is in progress.
    |
    |--------------------------------------------------------------------------
    */

    const handleTouchStart = (event) => {
        const point = pointFromTouchEvent(event);

        if (!point) {
            return;
        }

        handlePointerDown(point.clientX, point.clientY);
    };

    const handleTouchMove = (event) => {
        if (
            draggingPhotoIndex === null &&
            draggingSticker === null &&
            draggingText === null
        ) {
            return;
        }

        const point = pointFromTouchEvent(event);

        if (!point) {
            return;
        }

        if (event.cancelable) {
            event.preventDefault();
        }

        handlePointerMove(point.clientX, point.clientY);
    };

    const handleTouchEnd = () => {
        handlePointerUp();
    };

    /*
    |--------------------------------------------------------------------------
    | ADD STICKER
    |--------------------------------------------------------------------------
    */

    const addSticker = (src) => {
        const img = new Image();

        img.src = src;

        img.onload = () => {
            setStickers((previous) => [
                ...previous,
                {
                    img,
                    x: 400,
                    y: 100,
                    width: 150,
                    height: 150
                }
            ]);

            setSelectedSticker(stickers.length);
            setSelectedText(null);
        };
    };

    /*
    |--------------------------------------------------------------------------
    | ADD CUSTOM TEXT
    |--------------------------------------------------------------------------
    */

    const addText = () => {
        const finalText = newText.trim();

        if (!finalText) {
            return;
        }

        const newItem = {
            text: finalText,
            x: 150,
            y: 100,
            size: Number(textSize),
            color: textColor,
            font: textFont,
            bold: textBold,
            italic: textItalic
        };

        setTextItems((previous) => {
            const updated = [...previous, newItem];

            setSelectedText(updated.length - 1);

            return updated;
        });

        setSelectedSticker(null);
        setNewText("");
    };

    /*
    |--------------------------------------------------------------------------
    | UPDATE SELECTED TEXT
    |--------------------------------------------------------------------------
    */

    const updateSelectedText = (property, value) => {
        if (selectedText === null) {
            return;
        }

        setTextItems((previous) => {
            const updated = [...previous];

            if (!updated[selectedText]) {
                return updated;
            }

            updated[selectedText] = {
                ...updated[selectedText],
                [property]: value
            };

            return updated;
        });
    };

    /*
    |--------------------------------------------------------------------------
    | DOWNLOAD
    |--------------------------------------------------------------------------
    */

    const downloadPhoto = () => {
        if (!canvasRef.current) {
            return;
        }

        const previousSticker = selectedSticker;
        const previousText = selectedText;

        setSelectedSticker(null);
        setSelectedText(null);

        setTimeout(() => {
            drawCanvas();

            const link = document.createElement("a");

            link.href = canvasRef.current.toDataURL("image/png");
            link.download = "photo-strip.png";
            link.click();

            setSelectedSticker(previousSticker);
            setSelectedText(previousText);
        }, 50);
    };

    /*
    |--------------------------------------------------------------------------
    | CANVAS DISPLAY SIZE
    |--------------------------------------------------------------------------
    */

    const getCanvasStyle = () => {
        if (!frameImgRef.current) {
            return {
                width: isMobile ? webcamColumnWidth : 200,
                height: isMobile ? webcamColumnWidth * 1.25 : 500
            };
        }

        const width = frameImgRef.current.width;
        const height = frameImgRef.current.height;

        const ratio = width / height;

        let displayWidth = MAX_CANVAS_WIDTH;
        let displayHeight = displayWidth / ratio;

        if (displayHeight > MAX_CANVAS_HEIGHT) {
            displayHeight = MAX_CANVAS_HEIGHT;
            displayWidth = displayHeight * ratio;
        }

        return {
            width: displayWidth,
            height: displayHeight
        };
    };

    /*
    |--------------------------------------------------------------------------
    | SELECTED TEXT DATA
    |--------------------------------------------------------------------------
    */

    const selectedTextItem =
        selectedText !== null ? textItems[selectedText] : null;

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <div style={styles.centerCol}>
            {/* TOP BAR */}

            <div style={styles.topBar}>
                {selectedFrame && (
                    <button
                        style={{
                            ...styles.buttonStyle,
                            position: isMobile ? "static" : "absolute",
                            left: 0,
                            top: 10,
                            height: 40,
                            padding: "0 16px",
                            lineHeight: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: isMobile ? 8 : 0
                        }}
                        onClick={handleBack}
                    >
                        ← Back
                    </button>
                )}

                <h1 style={styles.titleBar}>
                    {!selectedFrame
                        ? "₊✩‧₊˚ Select a frame౨ৎ ˚₊✩‧₊"
                        : mode === "photo"
                        ? "⋆｡‧˚ʚ Smile :)ɞ˚‧｡⋆"
                        : ". ݁₊ ⊹ . ݁Let’s decorate . ⊹ ₊ ݁."}
                </h1>
            </div>

            {/* MAIN CONTENT */}

            <div style={styles.mainContent}>
                {!selectedFrame ? (
                    <div
                        style={{
                            display: "flex",
                            gap: isMobile ? 14 : 24,
                            flexWrap: "wrap",
                            justifyContent: "center"
                        }}
                    >
                        {frameOptions.map((frame) => (
                            <div
                                key={frame.id}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 6
                                }}
                            >
                                <img
                                    src={frame.src}
                                    alt={frame.id}
                                    onClick={() => selectFrame(frame)}
                                    onMouseEnter={(event) => {
                                        event.currentTarget.style.transform =
                                            "scale(1.08)";

                                        event.currentTarget.style.boxShadow =
                                            "0 12px 30px rgba(255,122,162,0.45)";
                                    }}
                                    onMouseLeave={(event) => {
                                        event.currentTarget.style.transform =
                                            "scale(1)";

                                        event.currentTarget.style.boxShadow =
                                            styles.frameThumb.boxShadow;
                                    }}
                                    style={{
                                        ...styles.frameThumb,
                                        transform: "scale(1)",
                                        transition:
                                            "transform 0.25s ease, box-shadow 0.25s ease"
                                    }}
                                />

                                <span
                                    style={{
                                        fontFamily: "CantikaCute",
                                        color: "#8c5b4a",
                                        fontSize: isMobile ? 14 : 16
                                    }}
                                >
                                    {frame.slotCount}{" "}
                                    {frame.slotCount === 1
                                        ? "photo"
                                        : "photos"}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={styles.row}>
                        <div style={{ width: "100%", maxWidth: webcamColumnWidth }}>
                            {/* PHOTO MODE */}

                            {mode === "photo" && (
                                <div
                                    style={{
                                        position: "relative",
                                        width: webcamColumnWidth,
                                        maxWidth: "100%",
                                        margin: "0 auto"
                                    }}
                                >
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/png"
                                        screenshotQuality={1}
                                        videoConstraints={videoConstraints}
                                        mirrored={true}
                                        style={{
                                            width: "100%",
                                            borderRadius: 12,
                                            display: "block"
                                        }}
                                    />

                                    {/* COUNTDOWN */}

                                    {countdown !== null && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: isMobile
                                                    ? "6rem"
                                                    : "10rem",
                                                color: "white",
                                                fontWeight: "bold",
                                                textShadow:
                                                    "0 4px 20px rgba(0,0,0,0.5)",
                                                background:
                                                    "rgba(0,0,0,0.25)",
                                                borderRadius: 12,
                                                pointerEvents: "none"
                                            }}
                                        >
                                            {countdown}
                                        </div>
                                    )}

                                    {/* BUTTONS */}

                                    <div
                                        style={{
                                            marginTop: 16,
                                            display: "flex",
                                            gap: 12,
                                            flexWrap: "wrap",
                                            justifyContent: isMobile
                                                ? "center"
                                                : "flex-start"
                                        }}
                                    >
                                        {canTakePhoto && (
                                            <>
                                                <button
                                                    style={
                                                        styles.buttonStyle
                                                    }
                                                    onClick={capturePhoto}
                                                >
                                                    Take Photo
                                                </button>

                                                <label
                                                    style={{
                                                        ...styles.buttonStyle,
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Upload

                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={uploadPhoto}
                                                        style={{
                                                            display: "none"
                                                        }}
                                                    />
                                                </label>
                                            </>
                                        )}

                                        {photoCount > 0 && (
                                            <button
                                                style={{
                                                    ...styles.buttonStyle,
                                                    fontSize: 22,
                                                    padding: "4px 10px"
                                                }}
                                                onClick={redoLastPhoto}
                                            >
                                                ⟳
                                            </button>
                                        )}
                                    </div>

                                    {/* PHOTO COUNTER */}

                                    {selectedFrameConfig && (
                                        <div
                                            style={{
                                                marginTop: 10,
                                                textAlign: "center",
                                                fontFamily: "CantikaCute",
                                                color: "#8c5b4a",
                                                fontSize: 18
                                            }}
                                        >
                                            Photo{" "}
                                            {Math.min(
                                                photoCount + 1,
                                                selectedFrameConfig.slotCount
                                            )}{" "}
                                            of{" "}
                                            {selectedFrameConfig.slotCount}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* DECORATE MODE */}

                            {mode === "decorate" && (
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 16
                                    }}
                                >
                                    {/* STICKERS */}

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 12,
                                            flexWrap: "wrap",
                                            justifyContent: isMobile
                                                ? "center"
                                                : "flex-start"
                                        }}
                                    >
                                        {stickerOptions.map((src) => (
                                            <img
                                                key={src}
                                                src={src}
                                                alt="sticker"
                                                onClick={() =>
                                                    addSticker(src)
                                                }
                                                style={{
                                                    width: stickerThumbSize,
                                                    cursor: "pointer"
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* TEXT PANEL */}

                                    <div
                                        style={{
                                            border: "2px solid #8c5b4a",
                                            borderRadius: 12,
                                            padding: 14,
                                            background:
                                                "rgba(255,255,255,0.8)",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 10,
                                            width: "100%",
                                            boxSizing: "border-box"
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontFamily: "CantikaCute",
                                                color: "#8c5b4a",
                                                fontSize: isMobile ? 18 : 22
                                            }}
                                        >
                                            Add Custom Text
                                        </div>

                                        {/* TEXT INPUT */}

                                        <input
                                            type="text"
                                            value={newText}
                                            onChange={(event) =>
                                                setNewText(
                                                    event.target.value
                                                )
                                            }
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    addText();
                                                }
                                            }}
                                            placeholder="Type something..."
                                            style={{
                                                padding: "10px",
                                                fontSize: 16,
                                                border: "1px solid #8c5b4a",
                                                borderRadius: 8,
                                                outline: "none",
                                                width: "100%",
                                                boxSizing: "border-box"
                                            }}
                                        />

                                        <button
                                            style={{
                                                ...styles.buttonStyle,
                                                width: "100%"
                                            }}
                                            onClick={addText}
                                        >
                                            ＋ Add Text
                                        </button>

                                        {/* FONT */}

                                        <label
                                            style={{
                                                fontFamily: "CantikaCute",
                                                color: "#8c5b4a",
                                                fontSize: 17
                                            }}
                                        >
                                            Font
                                        </label>

                                        <select
                                            value={
                                                selectedTextItem
                                                    ? selectedTextItem.font
                                                    : textFont
                                            }
                                            onChange={(event) => {
                                                const value =
                                                    event.target.value;

                                                if (selectedText !== null) {
                                                    updateSelectedText(
                                                        "font",
                                                        value
                                                    );
                                                } else {
                                                    setTextFont(value);
                                                }
                                            }}
                                            style={{
                                                padding: "8px",
                                                fontSize: 16,
                                                borderRadius: 8,
                                                border: "1px solid #8c5b4a",
                                                width: "100%",
                                                boxSizing: "border-box"
                                            }}
                                        >
                                            {textFontOptions.map((font) => (
                                                <option
                                                    key={font.id}
                                                    value={font.family}
                                                >
                                                    {font.name}
                                                </option>
                                            ))}
                                        </select>

                                        {/* FONT SIZE */}

                                        <label
                                            style={{
                                                fontFamily: "CantikaCute",
                                                color: "#8c5b4a",
                                                fontSize: 17
                                            }}
                                        >
                                            Size
                                        </label>

                                        <input
                                            type="range"
                                            min="20"
                                            max="120"
                                            value={
                                                selectedTextItem
                                                    ? selectedTextItem.size
                                                    : textSize
                                            }
                                            onChange={(event) => {
                                                const value = Number(
                                                    event.target.value
                                                );

                                                if (selectedText !== null) {
                                                    updateSelectedText(
                                                        "size",
                                                        value
                                                    );
                                                } else {
                                                    setTextSize(value);
                                                }
                                            }}
                                            style={{ width: "100%" }}
                                        />

                                        <div
                                            style={{
                                                textAlign: "center",
                                                fontFamily: "Poppins",
                                                color: "#8c5b4a"
                                            }}
                                        >
                                            {selectedTextItem
                                                ? selectedTextItem.size
                                                : textSize}{" "}
                                            px
                                        </div>

                                        {/* COLOR */}

                                        <label
                                            style={{
                                                fontFamily: "CantikaCute",
                                                color: "#8c5b4a",
                                                fontSize: 17
                                            }}
                                        >
                                            Text Color
                                        </label>

                                        <input
                                            type="color"
                                            value={
                                                selectedTextItem
                                                    ? selectedTextItem.color
                                                    : textColor
                                            }
                                            onChange={(event) => {
                                                const value =
                                                    event.target.value;

                                                if (selectedText !== null) {
                                                    updateSelectedText(
                                                        "color",
                                                        value
                                                    );
                                                } else {
                                                    setTextColor(value);
                                                }
                                            }}
                                            style={{
                                                width: "100%",
                                                height: 42,
                                                cursor: "pointer",
                                                border: "none",
                                                background: "transparent"
                                            }}
                                        />

                                        {/* BOLD / ITALIC */}

                                        <div
                                            style={{
                                                display: "flex",
                                                gap: 8
                                            }}
                                        >
                                            <button
                                                style={{
                                                    ...styles.buttonStyle,
                                                    flex: 1,
                                                    fontWeight: "bold",
                                                    background:
                                                        selectedTextItem
                                                            ? selectedTextItem.bold
                                                                ? "#f8dfe7"
                                                                : "white"
                                                            : textBold
                                                            ? "#f8dfe7"
                                                            : "white"
                                                }}
                                                onClick={() => {
                                                    if (
                                                        selectedText !== null
                                                    ) {
                                                        updateSelectedText(
                                                            "bold",
                                                            !selectedTextItem.bold
                                                        );
                                                    } else {
                                                        setTextBold(
                                                            !textBold
                                                        );
                                                    }
                                                }}
                                            >
                                                B
                                            </button>

                                            <button
                                                style={{
                                                    ...styles.buttonStyle,
                                                    flex: 1,
                                                    fontStyle: "italic",
                                                    background:
                                                        selectedTextItem
                                                            ? selectedTextItem.italic
                                                                ? "#f8dfe7"
                                                                : "white"
                                                            : textItalic
                                                            ? "#f8dfe7"
                                                            : "white"
                                                }}
                                                onClick={() => {
                                                    if (
                                                        selectedText !== null
                                                    ) {
                                                        updateSelectedText(
                                                            "italic",
                                                            !selectedTextItem.italic
                                                        );
                                                    } else {
                                                        setTextItalic(
                                                            !textItalic
                                                        );
                                                    }
                                                }}
                                            >
                                                I
                                            </button>
                                        </div>

                                        {/* SELECTED TEXT MESSAGE */}

                                        {selectedText !== null && (
                                            <div
                                                style={{
                                                    fontFamily: "Poppins",
                                                    fontSize: 13,
                                                    color: "#8c5b4a",
                                                    textAlign: "center"
                                                }}
                                            >
                                                Text selected — drag it on
                                                the canvas. Press Delete to
                                                remove it.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CANVAS */}

                        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <canvas
                                ref={canvasRef}
                                style={{
                                    ...getCanvasStyle(),
                                    maxWidth: "100%",
                                    borderRadius: 16,
                                    boxShadow:
                                        "0 10px 30px rgba(0,0,0,0.15)",
                                    cursor:
                                        mode === "decorate"
                                            ? "move"
                                            : "grab",
                                    touchAction: "none"
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onTouchCancel={handleTouchEnd}
                            />

                            {/* DOWNLOAD */}

                            {mode === "decorate" && (
                                <div
                                    style={{
                                        marginTop: 16,
                                        display: "flex",
                                        justifyContent: "center"
                                    }}
                                >
                                    <button
                                        style={styles.buttonStyle}
                                        onClick={downloadPhoto}
                                    >
                                        Download
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
