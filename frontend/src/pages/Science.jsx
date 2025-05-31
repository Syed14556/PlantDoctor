import React from "react";
import scienceBgVideo from '../assets/sciencebg.mp4';
// import scienceBgPoster from '../assets/sciencebg-poster.jpg'; // Optional: use if you have a poster image
import '../styles.css';

export default function Science() {
  return (
    <div className="page-container">
      {/* Black fade-in accessibility overlay */}
      <div className="black-fade-overlay"></div>

      {/* Science background video (with optional poster for instant feedback) */}
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        // poster={scienceBgPoster} // Uncomment if you add a poster image
      >
        <source src={scienceBgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="fancy-background fade-in" style={styles.container}>
        <h1>🔬 Scientific Thinking</h1>
        <p>
          Our project follows the core steps of the <strong>scientific method</strong> to solve real-world agricultural problems using AI:
        </p>
        <ol>
          <li><strong>Observation:</strong> Farmers and plant owners often struggle to diagnose diseases or soil problems in their plants.</li>
          <li><strong>Question:</strong> Can AI help accurately detect plant diseases and soil issues from just an image?</li>
          <li><strong>Research:</strong> We explored plant pathology, soil science, and machine learning techniques. We studied existing datasets and agricultural papers.</li>
          <li><strong>Hypothesis:</strong> If we train an AI on thousands of labeled plant disease images, it can learn to predict diseases accurately.</li>
          <li><strong>Experiment:</strong> We trained a deep learning model on a large dataset using image classification techniques, and tested its accuracy on new, unseen images.</li>
          <li><strong>Analysis:</strong> We refined the model with feedback and improved it with a second layer of analysis using GeminiPro to explain the predictions.</li>
          <li><strong>Conclusion:</strong> Our Plant Doctor AI successfully diagnoses plant health and explains its reasoning — making plant care easier and more scientific.</li>
        </ol>
        <p>
          This integration of machine learning and scientific methodology demonstrates how technology and science work hand in hand for a more sustainable future.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "900px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    lineHeight: "1.6",
    position: "relative",
    zIndex: 1,
    // No backgroundColor here; handled by .fancy-background in CSS for unified opacity
  }
};
