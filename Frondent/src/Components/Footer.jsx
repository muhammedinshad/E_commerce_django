import React from "react";
import { FaInstagram, FaTwitter, FaDiscord } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const socials = [
  { name: "Instagram", icon: FaInstagram },
  { name: "Twitter", icon: FaTwitter },
  { name: "Discord", icon: FaDiscord },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ft-footer">
      <div className="ft-container">
        {/* --- Top area --- */}
        <div className="ft-grid">
          {/* Column 1 — Brand */}
          <div className="ft-brand">
            <NavLink to="/" className="ft-logo" aria-label="ShoeCart home">
              Shoecart
            </NavLink>

            <p className="ft-tagline">
              Curating the finest sneakers for the modern collector. Quality and
              authenticity, delivered to your door.
            </p>

            <div className="ft-social">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href="#"
                    className="ft-social-link"
                    aria-label={social.name}
                    title={social.name}
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2 — Shop */}
          <div>
            <h2 className="ft-group-title">Shop</h2>
            <ul className="ft-group-list">
              <li>
                <span className="ft-plain">Nike</span>
              </li>
              <li>
                <span className="ft-plain">Adidas</span>
              </li>
              <li>
                <span className="ft-plain">New Drops</span>
              </li>
            </ul>
          </div>

          {/* Column 3 — Service */}
          <div>
            <h2 className="ft-group-title">Service</h2>
            <ul className="ft-group-list">
              <li>
                <NavLink to="/orders" className="ft-link">Track Order</NavLink>
              </li>
              <li>
                <NavLink to="/shipping" className="ft-link">Shipping</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="ft-link">Help</NavLink>
              </li>
            </ul>
          </div>

          {/* Column 4 — Social */}
          <div>
            <h2 className="ft-group-title">Social</h2>
            <ul className="ft-group-list">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <li key={social.name}>
                    <a href="#" className="ft-link">
                      <Icon size={14} aria-hidden="true" />
                      {social.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* --- Divider --- */}
        <hr className="ft-divider" />

        {/* --- Bottom bar --- */}
        <div className="ft-bottom">
          <p className="ft-copy">© {year} SOLESCRIPT INC. ALL RIGHTS RESERVED.</p>

          <div className="ft-legal">
            <NavLink to="/privacy" className="ft-link">Privacy</NavLink>
            <NavLink to="/terms" className="ft-link">Terms</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
