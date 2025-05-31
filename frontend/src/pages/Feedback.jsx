import React, { useState } from "react";
import feedbackBgVideo from "../assets/feedbackbg.mp4";
import '../styles.css';

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    // Send the POST request to Formspree
    const response = await fetch("https://formspree.io/f/movwalqq", {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      setSubmitted(true);
      form.reset();
    } else {
      alert("Sorry, there was a problem sending your feedback. Please try again later.");
    }
  };

  return (
    <div className="page-container">
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
        <source src={feedbackBgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="fancy-background fade-in">
        <h1>💬 Feedback & Contact Us</h1>
        <p>
          We hope you love using our web app! Your experience matters to us. If you have any suggestions, feedback, or run into any issues, please don’t hesitate to reach out.
        </p>
        <h2>📞 Contact Information</h2>
        <ul style={{ listStyle: "none", padding: 0, textAlign: "left", maxWidth: 400, margin: "1.5rem auto" }}>
          <li>
            <strong>Phone:</strong> <a href="tel:+1234567890" style={{ color: "#2e7d32" }}>+1 234 567 890</a>
          </li>
          <li>
            <strong>Email:</strong> <a href="mailto:plantdoctorcs@gmail.com" style={{ color: "#2e7d32" }}>plantdoctorcs@gmail.com</a>
          </li>
        </ul>
        <h2>📝 Quick Feedback Form</h2>
        {submitted ? (
          <p style={{ color: "#388e3c", fontWeight: "bold", fontSize: "1.2rem", textAlign: "center", margin: "2rem 0" }}>
            Thank you for contacting us! 🌱<br />
            We appreciate your feedback.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              maxWidth: 400,
              margin: "0 auto"
            }}
          >
            <label>
              Your Name:
              <input
                type="text"
                name="name"
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #a5d6a7"
                }}
              />
            </label>
            <label>
              Your Email:
              <input
                type="email"
                name="email"
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #a5d6a7"
                }}
              />
            </label>
            <label>
              Message:
              <textarea
                name="message"
                rows={4}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #a5d6a7"
                }}
              />
            </label>
            <button type="submit">Send Feedback</button>
          </form>
        )}
        <p style={{ marginTop: "2rem", color: "#388e3c" }}>
          Thank you for helping us grow and improve! 🌱
        </p>
      </div>
    </div>
  );
}
