import React from 'react'
import { NavLink } from 'react-router-dom'

export function useFrame(sarch) {
  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-6 py-16 pf-wrap">
        
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 gap-y-5 pf-grid">
          {sarch.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ item }) {
  const discount = item.oldPrice 
    ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) 
    : null;

  return (
    <NavLink
      to={`/deteals/${item.id}`}
      // Added a slightly more defined border color to match the screenshot box
      className="group flex flex-col no-underline border border-[#e5e7eb] hover:border-blue-400 transition-all duration-300 bg-white pf-card"
    >
      {/* 1. Pure White Image Container */}
      <div className="relative aspect-square flex items-center justify-center bg-white overflow-hidden p-2 pf-media">

        <img
          src={item.image}
          alt={item.name}
          // mix-blend-multiply ensures that if the source image has a 
          // slightly off-white background, it disappears into the plain white container
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 pf-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/600x600/ffffff/000000?text=No+Image";
          }}
        />
      </div>

      {/* 2. Product Details - Aligned to bottom-left with consistent padding */}
      <div className="flex flex-col space-y-2 p-6 pt-0 pf-info">
        <h3 className="text-[15px] text-[#1e40af] group-hover:text-blue-600 font-normal leading-tight pf-name">
          {item.name}
        </h3>
        
        <div className="flex items-center gap-3 pf-price-row">
          <span className="text-[18px] font-bold text-black pf-price">
            ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          
          {item.oldPrice && (
            <span className="text-[14px] text-gray-400 line-through pf-old">
              ${item.oldPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>
    </NavLink>
  )
}