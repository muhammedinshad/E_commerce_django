import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

export function useFrame(sarch) {

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "24px",
      padding: "32px 24px",
      fontFamily: "'Trebuchet MS', sans-serif",
    }}>
      {sarch.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  )
}

function ProductCard({ item }) {
  const [hovered, setHovered] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);

  return (
    <NavLink
      to={`/deteals/${item.id}`}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: "#ffffff",
        borderRadius: "12px",
        overflow: "hidden",
        border: hovered ? "1px solid rgba(255,59,48,0.4)" : "1px solid rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 16px 40px rgba(255,59,48,0.12), 0 4px 12px rgba(0,0,0,0.08)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        position: "relative",
      }}>

        {/* Red top bar on hover */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "3px",
          background: "#FF3B30",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.3s ease",
          zIndex: 2,
        }} />

        {/* Image container */}
        <div
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            background: "#f7f7f7",
            position: "relative",
          }}
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => setImgHovered(false)}
        >
          <img
            src={item.image}
            alt={item.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x600?text=No+Image";
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
              transform: imgHovered ? "scale(1.08)" : "scale(1)",
              display: "block",
            }}
          />

          {/* Dark overlay on hover */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.15)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }} />

          {/* Quick view badge */}
          <div style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: hovered ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(10px)",
            opacity: hovered ? 1 : 0,
            transition: "all 0.3s ease",
            background: "#FF3B30",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            padding: "7px 18px",
            borderRadius: "20px",
            whiteSpace: "nowrap",
          }}>
            View Details
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "16px 18px 18px" }}>

          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#FF3B30",
            }}>
              {item.brand}
            </span>

            {/* Red dot accent */}
            <span style={{
              width: "6px", height: "6px",
              borderRadius: "50%",
              background: hovered ? "#FF3B30" : "#e0e0e0",
              transition: "background 0.3s",
              display: "inline-block",
            }} />
          </div>

          {/* Product name */}
          <p style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#111111",
            margin: "0 0 10px",
            lineHeight: "1.4",
            letterSpacing: "0.2px",
          }}>
            {item.name}
          </p>

          {/* Price + arrow */}


        </div>
      </div>
    </NavLink>
  )
}