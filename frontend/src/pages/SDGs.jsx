import React from "react";
import "../styles.css";
import sdgsBgVideo from "../assets/sdgsbg.mp4"; // Your SDGs background video

// SDG images
import sdg2 from "../assets/sdg2.png";
import sdg3 from "../assets/sdg3.png";
import sdg9 from "../assets/sdg9.png";
import sdg13 from "../assets/sdg13.png";
import sdg15 from "../assets/sdg15.png";

export default function SDGs() {
  return (
    <div className="page-container">
      {/* Black fade overlay for smooth transition */}
      <div className="black-fade-overlay"></div>
      {/* Blurred background video */}
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={sdgsBgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Main glassy content box */}
      <div className="fancy-background">
        <h1>🌍 Sustainable Development Goals (SDGs)</h1>
        <p>
          Our <strong>Plant Doctor App</strong> directly supports several UN SDGs
          through the use of AI to detect plant diseases and promote soil health:
        </p>

        <div className="sdg-cards-grid">
          <div className="sdg-card">
            <img src={sdg2} alt="SDG 2: Zero Hunger" className="sdg-icon" />
            <strong>SDG 2: Zero Hunger</strong>
            <p>
              Improves food security by enabling early detection of plant diseases and ensuring healthier yields.
            </p>
          </div>
          <div className="sdg-card">
            <img src={sdg3} alt="SDG 3: Good Health & Well-being" className="sdg-icon" />
            <strong>SDG 3: Good Health & Well-being</strong>
            <p>
              Reduces reliance on hazardous chemical pesticides by promoting early, sustainable interventions.
            </p>
          </div>
          <div className="sdg-card">
            <img src={sdg9} alt="SDG 9: Industry, Innovation, and Infrastructure" className="sdg-icon" />
            <strong>SDG 9: Industry, Innovation, and Infrastructure</strong>
            <p>
              Uses AI innovation to support smarter, tech-enabled agriculture.
            </p>
          </div>
          <div className="sdg-card">
            <img src={sdg13} alt="SDG 13: Climate Action" className="sdg-icon" />
            <strong>SDG 13: Climate Action</strong>
            <p>
              Encourages practices that protect soil health and increase resilience to climate change.
            </p>
          </div>
          <div className="sdg-card">
            <img src={sdg15} alt="SDG 15: Life on Land" className="sdg-icon" />
            <strong>SDG 15: Life on Land</strong>
            <p>
              Prevents land degradation and supports biodiversity by managing plant diseases in an eco-friendly way.
            </p>
          </div>
        </div>

        <p style={{ marginTop: "20px" }}>
          Through smart diagnosis and sustainable farming support, our app is a step forward in creating a
          greener, healthier planet. 🌎
        </p>
      </div>
    </div>
  );
}
