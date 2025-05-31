import React from "react";
import aboutBgVideo from '../assets/aboutbg.mp4';
// import aboutBgPoster from '../assets/aboutbg-poster.jpg'; // Optional: use if you have a poster image
import '../styles.css';

export default function About() {
  return (
    <div className="page-container">
      {/* Black fade-in accessibility overlay */}
      <div className="black-fade-overlay"></div>
      
      {/* Background video, optimized for fast load */}
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        // poster={aboutBgPoster} // Uncomment if you add a poster image
      >
        <source src={aboutBgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="fancy-background fade-in">
        <h1>🌿 About Us</h1>
        <p>
          We are <strong>Shaazam (Grade 9N)</strong> and <strong>Ahmad (Grade 9P)</strong> from <strong>Woodlem Park School (WPS)</strong>. 
          As students deeply passionate about science, technology, and sustainability, we built this project to address real-world issues in agriculture using modern AI.
        </p>
        <p>
          Our web app, <strong>Plant Doctor</strong>, is designed to help farmers, gardeners, and students easily detect plant diseases and soil issues 
          through AI-powered image analysis. By simply uploading a picture, users receive instant predictions and helpful insights powered by our own PlantDoctorAI.
        </p>
        <p>
          This project was developed as part of our school's innovation initiative and integrates principles of <strong>scientific thinking</strong>, 
          <strong> sustainability</strong>, and <strong>environmental awareness</strong>.
        </p>
        <ul className="about-checklist">
          <li>✅ Reduce crop loss by identifying diseases early</li>
          <li>✅ Support sustainable farming practices</li>
          <li>✅ Encourage young minds to use AI for good</li>
        </ul>
        <p>
          This is more than a school project — it's our step toward making agriculture smarter and greener for the future. 🌍
        </p>
        <p style={{ fontStyle: "italic", color: "#555" }}>
          — Created by Shaazam & Ahmad, Grade 9 – WPS
        </p>
      </div>
    </div>
  );
}
