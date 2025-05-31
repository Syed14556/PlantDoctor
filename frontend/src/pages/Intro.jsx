import React from "react";
import '../styles.css';

export default function Intro({ onNext }) {
  return (
    <div style={styles.container}>
      <h1>🌿 Welcome to Plant Doctor</h1>
      <p>
        Plant Doctor is an AI-powered tool that analyzes plant diseases and soil
        problems from images you upload.
      </p>
      <p>
        Our mission is to help you keep your plants healthy while promoting sustainable agriculture.
      </p>
      <button style={styles.button} onClick={onNext}>Next</button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    padding: "0 20px",
  },
  button: {
    marginTop: "30px",
    padding: "10px 20px",
    fontSize: "18px",
    backgroundColor: "#2c6f4c",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
