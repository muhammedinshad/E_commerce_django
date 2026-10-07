import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getAllProducts } from '../../../api/api'; // ✅ existing API

export default function TrendingProducts({ isMobile }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');
    getAllProducts(token, '', '', 1)
      .then((res) => {
        // First 4 products മാത്രം
        setProducts(res.data.results.slice(0, 4));
      })
      .catch((err) => console.error(err));
  }, []);

  const badges = ['HOT', 'NEW', 'HOT', 'SALE'];
  const badgeStyle = {
    HOT:  { background: '#e74c3c', color: '#fff' },
    NEW:  { background: '#111',    color: '#fff' },
    SALE: { background: '#f39c12', color: '#fff' },
  };

  if (!products.length) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&display=swap');

        .tp-section {
          width: 100%;
          background: #fff;
          padding: ${isMobile ? '40px 16px 50px' : '60px 40px 70px'};
          font-family: 'Barlow', sans-serif;
        }

        .tp-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: ${isMobile ? '24px' : '36px'};
        }

        .tp-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.28em;
          color: #bbb;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .tp-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: ${isMobile ? '34px' : '46px'};
          color: #111;
          line-height: 1;
          letter-spacing: 0.03em;
        }

        .tp-view-all {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #111;
          text-decoration: none;
          border-bottom: 1.5px solid #111;
          padding-bottom: 2px;
          transition: color 0.2s, border-color 0.2s;
        }
        .tp-view-all:hover { color: #888; border-color: #888; }

        .tp-grid {
          display: grid;
          grid-template-columns: ${isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'};
          gap: ${isMobile ? '12px' : '16px'};
        }

        .tp-card {
          position: relative;
          background: #f7f7f7;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.35s ease;
        }
        .tp-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .tp-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .tp-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .tp-card:hover .tp-img-wrap img {
          transform: scale(1.07) translateY(-4px);
        }

        .tp-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 2px;
          z-index: 2;
        }

        .tp-quick {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: rgba(17,17,17,0.92);
          color: #fff;
          text-align: center;
          padding: 11px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
          z-index: 3;
        }
        .tp-card:hover .tp-quick { transform: translateY(0); }

        .tp-info {
          padding: ${isMobile ? '10px 12px 14px' : '14px 14px 18px'};
        }

        .tp-name {
          font-size: ${isMobile ? '12px' : '14px'};
          font-weight: 500;
          color: #1e40af;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tp-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tp-price {
          font-size: ${isMobile ? '13px' : '15px'};
          font-weight: 700;
          color: #111;
        }

        .tp-old-price {
          font-size: 11px;
          color: #bbb;
          text-decoration: line-through;
        }
      `}</style>

      <section className="tp-section">
        <div className="tp-header">
          <div>
            <div className="tp-eyebrow">What's Hot</div>
            <div className="tp-title">TRENDING NOW</div>
          </div>
          <Link to="/product" className="tp-view-all">View All</Link>
        </div>

        <div className="tp-grid">
          {products.map((item, index) => {
            const badge = badges[index];
            return (
              <NavLink
                key={item.id}
                to={`/deteals/${item.id}`}
                className="tp-card"
              >
                <div className="tp-img-wrap">
                  <span className="tp-badge" style={badgeStyle[badge]}>{badge}</span>

                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x600/ffffff/000000?text=No+Image";
                    }}
                  />

                  <div className="tp-quick">View Details →</div>
                </div>

                <div className="tp-info">
                  <div className="tp-name">{item.name}</div>
                  <div className="tp-price-row">
                    <span className="tp-price">
                      ${item.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    {item.oldPrice && (
                      <span className="tp-old-price">
                        ${item.oldPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>
      </section>
    </>
  );
}