import React, { useState, useEffect } from 'react';
import Product from './Product';
import Footer from "../../../Components/Footer";

const slides = [
  { 
    type: "video", 
    src: "/intro2.mp4", 
    title: "Innovating the Future", 
    subtitle: "Experience next-generation design and performance." 
  },
  { 
    type: "image", 
    src: "/intro.jpeg", 
    title: "Premium Quality", 
    subtitle: "Crafted with precision for the modern user." 
  },
  { 
    type: "video", 
    src: "/intro4.mp4", 
    title: "Limitless Potential", 
    subtitle: "Explore the possibilities of our latest collection." 
  },
  { 
    type: "image", 
    src: "/intro5.jpeg", 
    title: "Seamless Integration", 
    subtitle: "Tools built to work perfectly with your workflow." 
  },
];

function Home() {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle Resize to detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    
    const timer = setInterval(() => {
      handleNext();
    }, 8000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, [current]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[current];

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Section */}
      <section style={{ 
        position: "relative", 
        width: "100%", 
        // DESKTOP: 85vh | MOBILE: 50vh (Half Screen)
        height: isMobile ? "50vh" : "85vh", 
        overflow: "hidden", 
        backgroundColor: '#000',
        transition: "height 0.3s ease" // Smooth transition if resizing
      }}>
        
        {/* Media Container */}
        <div style={{ width: "100%", height: "100%" }}>
          {slide.type === "video" ? (
            <video
              key={slide.src}
              src={slide.src}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }}
            />
          ) : (
            <img
              key={slide.src}
              src={slide.src}
              alt="Hero Slide"
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }}
            />
          )}
        </div>

        {/* Text Overlay */}
        <div style={{
          position: "absolute", inset: 0, 
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))",
          color: "white", textAlign: "center", padding: "0 20px"
        }}>
          <h1 style={{ 
            fontSize: isMobile ? "1.5rem" : "3.5rem", // Smaller font for mobile
            fontWeight: "700", 
            marginBottom: "0.5rem", 
            letterSpacing: "-0.03em",
            textTransform: "uppercase" 
          }}>
            {slide.title}
          </h1>
          <p style={{ 
            fontSize: isMobile ? "0.8rem" : "1.1rem", // Smaller font for mobile
            maxWidth: "500px", 
            opacity: 0.8,
            fontWeight: "300",
            letterSpacing: "0.05em"
          }}>
            {slide.subtitle}
          </p>
        </div>

        {/* Navigation Arrows - Hidden or smaller on mobile for cleaner look */}
        <button onClick={handlePrev} style={arrowStyle('left', isMobile)}>‹</button>
        <button onClick={handleNext} style={arrowStyle('right', isMobile)}>›</button>

        {/* Progress Dots */}
        <div style={{
          position: "absolute", bottom: isMobile ? "15px" : "24px", left: "50%",
          transform: "translateX(-50%)", display: "flex", gap: "10px", zIndex: 10
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? "24px" : "8px", height: "4px",
                borderRadius: "2px", background: i === current ? "#fff" : "rgba(255,255,255,0.3)",
                border: "none", cursor: "pointer", transition: "all 0.4s ease"
              }}
            />
          ))}
        </div>
      </section>

      {/* Product Section */}
      <div id="product-section"  style={{ padding: isMobile ? "20px 0" : "40px 0" }}>
          <Product />
      </div>

      <Footer />
    </div>
  );
}

// Adjusted Arrow Style for Mobile
const arrowStyle = (direction, isMobile) => ({
  position: "absolute",
  [direction]: isMobile ? "10px" : "20px", // Closer to edge on mobile
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  fontSize: isMobile ? "24px" : "40px", // Smaller arrows on mobile
  cursor: "pointer",
  color: "rgba(255,255,255,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "color 0.3s ease",
  zIndex: 10,
  padding: "10px"
});

export default Home;