import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import { setBrand } from '../redux/userSlice';


const brands = [
  {
    id: 'nike',
    name: 'NIKE',
    filter: 'Nike',
    sub: 'Air Force 1 · Just Do It',
    image: '/nike-af1.jpeg',
    bgColor: '#8B1A1A',
    accent: '#f5c518',
  },
  {
    id: 'puma',
    name: 'PUMA',
    filter: 'Puma',
    sub: 'Speedcat OG · Forever Faster',
    image: '/puma-speedcat.jpeg',
    bgColor: '#0e5a5a',
    accent: '#f39c12',
  },
  {
    id: 'adidas',
    name: 'ADIDAS',
    filter: 'Adidas',
    sub: 'Gazelle · Impossible is Nothing',
    image: '/adidas-gazelle.jpeg',
    bgColor: '#b5820a',
    accent: '#ffffff',
  },
  {
    id: 'asics',
    name: 'NEW BALANCE',
    filter: 'New Balance',
    sub: 'Gel Series · Sound Mind, Sound Body',
    image: '/asics-gel.jpeg',
    bgColor: '#7a6a55',
    accent: '#e74c3c',
  },
];

function BrandCard({ brand, isHovered, onEnter, onLeave, isMobile,onClick }) {

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        flex: isHovered ? 3.2 : 1,
        transition: 'flex 0.65s cubic-bezier(0.77,0,0.18,1)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${brand.image})`,
        backgroundColor: brand.bgColor,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: isHovered ? 'scale(1)' : 'scale(1.08)',
        filter: isHovered ? 'brightness(0.75)' : 'brightness(0.5)',
        transition: 'transform 0.65s cubic-bezier(0.77,0,0.18,1), filter 0.65s ease',
      }} />

      {/* Left gradient on hover */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 65%)',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.5s ease',
        zIndex: 1,
      }} />

      {/* Collapsed: vertical brand name */}
      <div style={{
        position: 'absolute',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%) rotate(-90deg)',
        transformOrigin: 'center center',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 20,
        letterSpacing: '0.12em',
        color: 'rgba(255,255,255,0.85)',
        whiteSpace: 'nowrap',
        zIndex: 2,
        opacity: isHovered ? 0 : 1,
        transition: 'opacity 0.25s ease',
        userSelect: 'none',
      }}>
        {brand.name}
      </div>

      {/* Expanded: content */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 3,
        padding: isMobile ? '20px 18px 24px' : '28px 32px 36px',
        opacity: isHovered ? 1 : 0,
        transform: isHovered ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.4s ease 0.22s, transform 0.4s ease 0.22s',
        pointerEvents: isHovered ? 'all' : 'none',
      }}>
        <div style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.3em',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          Featured Brand
        </div>

        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: isMobile ? 42 : 58,
          color: '#fff',
          lineHeight: 0.9,
          letterSpacing: '0.02em',
        }}>
          {brand.name}
        </div>

        <div style={{
          height: 2,
          width: 32,
          background: brand.accent,
          margin: '14px 0 10px',
        }} />

        <div style={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 300,
        }}>
          {brand.sub}
        </div>
      </div>

      {/* Arrow icon top-right */}
      <div style={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 3,
        width: 28,
        height: 28,
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 13,
        opacity: isHovered ? 1 : 0,
        transform: isHovered ? 'scale(1)' : 'scale(0.6)',
        transition: 'all 0.35s ease 0.28s',
      }}>
        ↗
      </div>
    </div>
  );
}

export default function BrandHorizontal({ isMobile }) {
  const [hovered, setHovered] = useState(null);
      
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Click handling function
  const handleBrandClick = (brand) => {
    dispatch(setBrand(brand.filter));
    navigate('/product');
  };

  // Mobile: stack vertically with fixed height per card
  if (isMobile) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;700&display=swap');
        `}</style>
        <section style={{ background: '#0d0d0d', width: '100%' }}>
          <p style={{
            textAlign: 'center',
            padding: '24px 0 16px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.28em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
          }}>
            Shop by Brand
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {brands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => handleBrandClick(brand)}
                style={{
                  position: 'relative',
                  height: 140,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${brand.image})`,
                  backgroundColor: brand.bgColor,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.55)',
                }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)',
                  zIndex: 1,
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: 18,
                  left: 20,
                  zIndex: 2,
                }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 38,
                    color: '#fff',
                    lineHeight: 0.9,
                  }}>
                    {brand.name}
                  </div>
                  <div style={{ height: 2, width: 28, background: brand.accent, margin: '8px 0 6px' }} />
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    {brand.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;700&display=swap');
      `}</style>

      <section style={{ background: '#0d0d0d', width: '100%' }}>
        <p style={{
          textAlign: 'center',
          padding: '46px 0 32px',
          fontSize: 11,
          fontWeight: 750,
          letterSpacing: '0.28em',
          color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
        }}>
          Shop by Brand
        </p>

        {/* Horizontal expanding cards */}
        <div style={{ display: 'flex', height: 460, width: '100%' }}>
          {brands.map((brand, i) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              isHovered={hovered === i}
              onEnter={() => setHovered(i)}
              onLeave={() => setHovered(null)}
              isMobile={false}
              onClick={() => handleBrandClick(brand)}
            />
          ))}
        </div>
      </section>
    </>
  );
}