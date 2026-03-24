import React, { useState } from 'react';
import Product from './Product';
import Footer from "../../../Components/Footer";

function Home() {
    // 1. Define your media list (mix of videos and images)
    const mediaItems = [
        { type: 'video', src: '/intro2.mp4' },
        { type: 'image', src: '/https://i.pinimg.com/736x/7d/85/11/7d8511a2fdfe40b593fb9b282220efd1.jpg' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // 2. Handler to cycle through media
    const nextMedia = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
    };

    const currentMedia = mediaItems[currentIndex];

    return (
        <div>
            <div style={{ position: "relative", width: "100%" }}>
                {/* 3. Conditional Rendering based on type */}
                {currentMedia.type === 'video' ? (
                    <video
                        key={currentMedia.src} // Important: 'key' forces React to reload the new video
                        src={currentMedia.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{ width: "100%", display: "block" }}
                    />
                ) : (
                    <img
                        src={currentMedia.src}
                        alt="Hero Banner"
                        style={{ width: "100%", display: "block", height: "auto" }}
                    />
                )}

                {/* 4. Overlay Button */}
                <button
                    onClick={nextMedia}
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        padding: "10px 20px",
                        backgroundColor: "rgba(255,255,255,0.7)",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px"
                    }}
                >
                    Next Media
                </button>
            </div>

            <Product />
            <Footer />
        </div>
    );
}

export default Home;