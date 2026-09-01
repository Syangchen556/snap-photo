import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const frameOptions = [
    "assets/frames/f1.png",
    "assets/frames/f2.png",
    "assets/frames/f3.png",
    "assets/frames/f4.png",
    "assets/frames/f5.png",
    "assets/frames/f6.png",
    "assets/frames/f7.png",
    "assets/frames/f8.png",
    "assets/frames/f9.png",
    "assets/frames/f10.png",
    "assets/frames/f11.png",
    "assets/frames/f12.png",
    "assets/frames/f13.png",
    "assets/frames/f14.png",
    "assets/frames/f15.png",
    "assets/frames/f16.png",
    "assets/frame/f19.pbg"
]

const stickerOptions = [
    "assets/stickers/sticker1.png",
    "assets/stickers/sticker2.png",
    "assets/stickers/sticker3.png",
    "assets/stickers/sticker4.png",
]

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

const SLOT_WIDTH = 953;
const SLOT_HEIGHT = 599;

export default function PhotoBooth() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const frameRef = useRef(null);
    const frameImgRef = useRef(null);

    const slots = [
        { x: 0, y: 0 },
        { x: SLOT_WIDTH, y: 0 },
        { x: 0, y: SLOT_HEIGHT },
        { x: SLOT_WIDTH, y: SLOT_HEIGHT }
    ]

    const [selectedFrame, setSelectedFrame] = useState(null);
    const [mode, setMode] = useState('photo'); //for photobooth
    const [photos, setPhotos] = useState([]);
    const [photoCount, setPhotoCount] = useState(0);
    const [canTakePhoto, setCanTakePhoto] = useState(true);
    const [draggingPhotoIndex, setDraggingPhotoIndex] = useState(null);
    const [draggingSticker, setDraggingSticker] = useState(null);
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [countdown, setCountdown] = useState(null);
    const [stickers, setStickers] = useState([]);

    const row = {display:"flex", gap: 40, alignItems: "flex-start"}; 

    //Useeffects
    //frames
    useEffect(() => {
        if (!selectedFrame) return;

        const img = new Image ();
        img.src = selectedFrame;

        img.onload = () => {
            frameImgRef.current = img;
            drawCanvas();
        }
    }, [selectedFrame]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !frameImgRef.current) return;

        const ctx = canvas.getContext('2d');
        const frameWidth = frameImgRef.current.width;
        const frameHeight = frameImgRef.current.height;

        canvas.width = frameWidth;
        canvas.height = frameHeight;

        ctx.clearRect(0,0, canvas.width, canvas.height); //clears canvas

        photos.forEach ( p=>{
            const slot = slots[p.slotIndex];
            if (!slot) return;

            const drawW = p.img.width *p.scale;
            const drawH = p.img.height *p.scale;
            const dx = slot.x + (SLOT_WIDTH - drawW)/2 + p.offsetX;
            const dy = slot.y + (SLOT_HEIGHT - drawH)/2 + p.offsetY;

            ctx.save();
            ctx.beginPath();
            ctx.rect(slot.x, slot.y, SLOT_WIDTH, SLOT_HEIGHT);
            ctx.clip();
            ctx.drawImage(p.img, dx, dy, drawW, drawH);
            ctx.restore();
        });

        stickers.forEach(s => {
            ctx.drawImage(s.img, s.x, s.y, 150, 150);
        });

        ctx.drawImage(frameImgRef.current, 0, 0, frameWidth, frameHeight);
    };

    useEffect(drawCanvas, [photos, photoCount, stickers]);

    //photos
    const addPhoto = (img) => {
        if (photoCount >= 6) return;

        const scale = SLOT_WIDTH / img.width * 0.9; // scale to fit slot width with some margin
        const drawH = img.height * scale;
        const offsetY = (SLOT_HEIGHT - drawH) / 2; // center vertically in slot

        setPhotos(p => [
            ...p,
            {img, slotIndex: photoCount, scale, offsetX: 0, offsetY}
        ]);

        setCanTakePhoto(true);

        setPhotoCount(c => {
            const next = c+1;
            if (next === 6) setMode("decorate");
            return next;
        });
    };

    const takePhotoNow = () =>{
        if (!webcamRef.current) return;

        const src = webcamRef.current.getScreenshot();
        if (!src) return;

        const img = new Image();
        img.src = src;

        img.onload = () => addPhoto(img);
    };

    const capturePhoto = () => {
        if (!canTakePhoto || countdown !== null) return;

        setCanTakePhoto(false);
        setCountdown(3);

        let current = 3;

        const interval = setInterval(() => {
            current -=1;

            if (current === 0) {
                clearInterval(interval);
                setCountdown(null);
                takePhotoNow();
            } else {
                setCountdown(current);
            }
        },1000);
    }

    const uploadPhoto = e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;

            img.onload = () => addPhoto(img);
        };

        reader.readAsDataURL(file);
        e.target.value = "";
    };

    const redoLastPhoto = () => {
        if (!photos.length) return;

        setPhotos(p => p.slice(0, -1));
        setPhotoCount(c => Math.max(0, c - 1));
        setCanTakePhoto(true);
        setMode("photo");
    };

    const addSticker = (src) => {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            setStickers(s => [
                ...s,
                { img, x: 100, y: 100 }
            ]);
        };
    };

    const getCoords = e => {
        const r = canvasRef.current.getBoundingClientRect();

        return {
            x: (e.clientX - r.left) * (canvasRef.current.width / r.width),
            y: (e.clientY - r.top) * (canvasRef.current.height / r.height)
        };
    };

    // drag photos
    const handleMouseDown = e => {
        const { x, y } = getCoords(e);

        if (mode === "photo") {
            for (let i = photos.length - 1; i >= 0; i--) {
                const p = photos[i];
                const slot = slots[p.slotIndex];

                if (!slot) continue;

                const w = p.img.width * p.scale;
                const h = p.img.height * p.scale;

                if(
                    x >= slot.x + p.offsetX &&
                    x <= slot.x + p.offsetX + w &&
                    y >= slot.y + p.offsetY &&
                    y <= slot.y + p.offsetY + h
                ) {
                    setDraggingPhotoIndex(i);

                    setDragOffset({
                        x: x - slot.x - p.offsetX,
                        y: y - slot.y - p.offsetY
                    });

                    return;
                }
            }
        }

        if (mode === "decorate") {
            for(let i = stickers.length - 1; i >= 0; i--){
                const s = stickers[i];

                if (x >= s.x && x <= s.x + 150 && y >= s.y && y <= s.y + 150) {
                    setDraggingSticker(i);
                    setSelectedSticker(i);
                    setDragOffset({x: x-s.x, y: y-s.y});
                    return;
                }
            }
        }
    };

    const handleMouseMove = e => {
        const {x,y} = getCoords(e);

        if (draggingPhotoIndex !== null && mode === "photo") {
            setPhotos(prev => {
                const updated = [...prev];
                const p = updated[draggingPhotoIndex];

                if (!p) return updated;

                const slot = slots[p.slotIndex];
                const w = p.img.width * p.scale;
                const h = p.img.height * p.scale;

                p.offsetX = x - slot.x - dragOffset.x;
                p.offsetY = y - slot.y - dragOffset.y;

                p.offsetX = Math.min(Math.max(p.offsetX, SLOT_WIDTH - w), 0);
                p.offsetY = Math.min(Math.max(p.offsetY, SLOT_HEIGHT - h),0);

                return updated;
            });
        }   

        if (draggingSticker !== null && mode === "decorate") {
            setStickers(s => {
                const u = [...s];

                if (!u[draggingSticker]) return u;

                u[draggingSticker] = {
                    ...u[draggingSticker],
                    x: x - dragOffset.x,
                    y: y - dragOffset.y
                };

                return u;
            });
        }
    };

    const handleMouseUp = () => {
        setDraggingPhotoIndex(null);
        setDraggingSticker(null);
    };

    const downloadPhoto = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement("a");
        link.download = "photobooth.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <div style={centerCol}>
            {/*top bar with buttons to select mode and frame8*/}
            <div style={topBar}>
                <button
                    style={{
                        ...buttonStyle,
                        position: "absolute",
                        left: 0,
                        top: 10,
                        height: 40,
                        padding: "0 16px",
                        lineHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={() => {
                        setSelectedFrame(null);
                        setMode("photo");
                    }}
                >
                    Back
                </button>

                <h1 style={titleBar}>
                    {!selectedFrame
                        ? "₊✩‧₊˚ Select a frame౨ৎ ˚₊✩‧₊"
                        : mode === "photo"
                            ? "⋆｡‧˚ʚ Smile :)ɞ˚‧｡⋆"
                            : ". ݁₊ ⊹ . ݁Let’s decorate . ⊹ ₊ ݁."
                    }
                </h1>
            </div>

            <div style={mainContent}>
                {!selectedFrame ? (
                    <div style={{ display: "flex", gap: 24 }}>
                        {frameOptions.map((src) => {
                            const isSelected = selectedFrame === src;

                            return (
                                <img
                                    key={src}
                                    src={src}
                                    alt="frame"
                                    onClick={() => setSelectedFrame(src)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.08)";
                                        e.currentTarget.style.boxShadow = "0 12px 30px rgba(255,122,162,0.45)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.boxShadow = frameThumb.boxShadow;
                                    }}
                                    style={{
                                        ...frameThumb,
                                        transform: isSelected ? "scale(1.08)" : "scale(1)",
                                        transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                        boxShadow: isSelected ? "0 12px 30px rgba(255,122,162,0.45)" : frameThumb.boxShadow,
                                    }}
                                />
                            )
                        })}
                    </div>
                ) : (
                    <div style={row}>
                        <div>
                            {mode === "photo" && (
                                <>
                                    <div style={{position: "relative", width: 400}}>
                                        {/*webcam*/}
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/png"
                                            videoConstraints={videoConstraints}
                                            mirrored={true}
                                            style={{ width:"100%", borderRadius: 12}}
                                        />

                                        {/*Overlay countdown on webcam*/}
                                        {countdown !== null && (
                                            <div style={{
                                                position: "absolute",
                                                inset: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "10rem",
                                                color: "white",
                                                fontWeight: "bold",
                                                textShadow:"0px 4px 20px rgba(0,0,0,0.5)",
                                                background: "rgba(0,0,0,0.25)",
                                                borderRadius: 12,
                                                pointerEvents: "none",
                                            }}>
                                                {countdown}
                                            </div>
                                        )}

                                        {/* Buttons */}
                                        <div style={{marginTop: 16, display: "flex", gap:12}}>
                                            {canTakePhoto && (
                                                <>
                                                    <button style={buttonStyle} onClick={capturePhoto}>
                                                        Take Photo
                                                    </button>

                                                    <label style={{...buttonStyle, cursor: "pointer"}}>
                                                        Upload
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={uploadPhoto}
                                                            style={{ display: "none"}}
                                                        />
                                                    </label>
                                                </>
                                            )}

                                            {/* redo btn */}
                                            {photoCount > 0 && (
                                                <button
                                                    style={{
                                                        ...buttonStyle,
                                                        fontSize: 22,
                                                        padding: "4px 10px"
                                                    }}
                                                    onClick={redoLastPhoto}
                                                >
                                                    ⟳
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {mode === "decorate" && (
                                stickerOptions.map((src) => (
                                    <img
                                        key={src}
                                        src={src}
                                        alt="sticker"
                                        onClick={() => addSticker(src)}
                                        style={{ width: 50, cursor: "pointer"}}
                                    />
                                ))
                            )}
                        </div>

                        {/* Display frame */}
                        <div>
                            <canvas
                                ref={canvasRef}
                                style={{
                                    width: 200,
                                    height: 500,
                                    borderRadius: 16,
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            />

                            {mode === "decorate" && (
                                <div style={{
                                    marginTop: 16,
                                    display:"flex",
                                    justifyContent: "center",
                                }}>
                                    <button style={buttonStyle} onClick={downloadPhoto}>
                                        Download
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// styles
const centerCol = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20
};

const topBar = {
    width: 700,
    height: 60,
    position: "relative",
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const buttonStyle = {
    padding: "10px 20px",
    fontSize: 20,
    cursor: "pointer",
    fontFamily: "CantikaCute",
    color: "#8c5b4a",
    border: "2px solid #8c5b4a",
    borderRadius: 8,
    background: "white"
};

const frameThumb = {
    width: 180,
    cursor: "pointer",
    borderRadius: 12,
    boxShadow: "0 8px 8px rgba(0,0,0,0.15)"
};

const titleBar = {
    margin: 0,
    lineHeight: "60px",
    textAlign: "center",
    width: "100%"
};

const mainContent = {
    minHeight: 600,
    width: 700,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
};