import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import plantlogo from "../assets/plantlogo.png";
import "../Navbar.css";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimeout = useRef(null);

  const handleHamburgerClick = () => {
    if (menuOpen) {
      setClosing(true);
      closeTimeout.current = setTimeout(() => {
        setMenuOpen(false);
        setClosing(false);
      }, 300);
    } else {
      setMenuOpen(true);
    }
  };

  const handleLinkClick = () => {
    setClosing(true);
    closeTimeout.current = setTimeout(() => {
      setMenuOpen(false);
      setClosing(false);
    }, 300);
  };

  React.useEffect(() => {
    return () => clearTimeout(closeTimeout.current);
  }, []);

  return (
    <nav style={styles.nav} aria-label="Main navigation">
      <div className="logo-wrapper glowing" style={styles.logoContainer}>
        <img
          src={plantlogo}
          alt="Plant Doctor Logo"
          className="glowing-logo"
          style={styles.logoImage}
        />
        <span className="glowing-logo-text" style={styles.logoText}>
          Plant Doctor
        </span>
      </div>

      <button
        className={`navbar-hamburger${menuOpen ? " open" : ""}`}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="navbar-links"
        onClick={handleHamburgerClick}
        style={styles.hamburger}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        id="navbar-links"
        className={`navbar-links${menuOpen ? " open" : ""}${closing ? " closing" : ""}`}
      >
        <Link className="nav-link" to="/" onClick={handleLinkClick}>
          Home
        </Link>
        <Link className="nav-link" to="/about" onClick={handleLinkClick}>
          About Us
        </Link>
        <Link className="nav-link" to="/science" onClick={handleLinkClick}>
          Scientific Thinking
        </Link>
        <Link className="nav-link" to="/methodology" onClick={handleLinkClick}>
          How We Did It
        </Link>
        <Link className="nav-link" to="/sdgs" onClick={handleLinkClick}>
          SDGs
        </Link>
        <Link className="nav-link" to="/plant-quiz" onClick={handleLinkClick}>
          Test Your Plant Knowledge!
        </Link>
        <Link className="nav-link" to="/chat" onClick={handleLinkClick}>
          Plant Buddy
        </Link>
        <Link className="nav-link" to="/feedback" onClick={handleLinkClick}>
          Feedback & Contact
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#2c6f4c",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    justifyContent: "flex-start",
    fontWeight: "bold",
    position: "relative",
    zIndex: 100,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  logoImage: {
    width: "60px",
    height: "60px",
    objectFit: "contain",
  },
  logoText: {
    fontSize: "22px",
    fontWeight: "900",
    userSelect: "none",
    color: "#fff",
  },
  hamburger: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    background: "none",
    border: "none",
    cursor: "pointer",
    marginLeft: "auto",
    zIndex: 110,
    padding: 0,
  },
};
