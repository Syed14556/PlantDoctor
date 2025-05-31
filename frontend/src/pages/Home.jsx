// src/pages/Home.jsx
import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import ScienceTipBox from "../components/ScienceTipBox"; // ensure path is correct
import homeBgVideo from "../assets/homebg.mp4";
import "../styles.css"; // your global styles

export default function Home() {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleImageChange = (e) => {
    e.preventDefault();
    setImage(e.target.files[0]);
    setResponse(null);
    setError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
      setResponse(null);
      setError(null);
    }
  };

  const handleUploadClick = () => {
    inputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("⚠️ Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.message ||
          "⚠️ Failed to connect to backend. Make sure it's running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Science tip box */}
      <ScienceTipBox />

      {/* Black fade overlay */}
      <div className="black-fade-overlay"></div>

      {/* Background video */}
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={homeBgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Main content box */}
      <div className="fancy-background fade-in" style={styles.container}>
        <p>
          Welcome to <strong>Plant Doctor</strong> — your AI-powered assistant
          for identifying plant diseases and soil health issues. Simply upload
          a clear photo of your plant or soil, and get instant insights to keep
          your garden thriving!
        </p>

        {/* Dropbox */}
        <div
          className={`upload-box${dragActive ? " drag-active" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") handleUploadClick();
          }}
        >
          {image ? <p>{image.name}</p> : <p>Drag & drop an image here, or click to select</p>}
          <input
            ref={inputRef}
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
            id="imageUpload"
          />
        </div>

        {/* Analyze Button */}
        <button
          className="analyze-button"
          onClick={handleSubmit}
          disabled={loading || !image}
        >
          {loading ? <span className="spinner" /> : "Analyze"}
        </button>

        <div className="steps fade-in">
          <h2>How to use:</h2>
          <ol>
            <li>Take a clear photo of your plant leaf or soil.</li>
            <li>Upload the image using the box above.</li>
            <li>Click <strong>Analyze</strong> and wait for the AI diagnosis.</li>
            <li>Review the results and take recommended actions to protect your plants.</li>
          </ol>
        </div>

        {error && (
          <p style={{ color: "red" }} className="fade-in">
            {error}
          </p>
        )}

        {response && (
          <div className="result fade-in">
            <h2>Model Analysis</h2>
            <div className="analysis markdown-body">
              <ReactMarkdown>{response.analysis}</ReactMarkdown>
            </div>
          </div>
        )}

        <footer
          style={{ marginTop: "3rem", fontStyle: "italic", color: "#4caf50" }}
          className="fade-in"
        >
          Together, let's grow a healthier, greener planet! 🌎💚
        </footer>
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
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    lineHeight: "1.6",
    position: "relative",
    zIndex: 1,
  },
};
