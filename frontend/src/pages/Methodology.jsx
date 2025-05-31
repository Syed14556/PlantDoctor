import React from "react";
import quizBgVideo from "../assets/processbg.mp4"; // Use your background video here
import '../styles.css';

export default function Methodology() {
  return (
    <div className="page-container">
      <div className="black-fade-overlay"></div>
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={quizBgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Only use the class, not the inline style */}
      <div className="fancy-background">
        <h1>⚙️ How We Did It</h1>
        <p>
          The development of Plant Doctor involved integrating multiple technologies, carefully following a step-by-step engineering and design process. Here's how we brought our vision to life:
        </p>

        <h2>🧠 AI Model Training</h2>
        <ul>
          <li>
            We trained a deep learning model (Convolutional Neural Network) on a large dataset of plant leaf images from various species.
          </li>
          <li>
            The model learned to distinguish between healthy plants and various diseases such as bacterial blight, early blight, and leaf spot.
          </li>
          <li>
            We evaluated and validated the model's accuracy using a test dataset, fine-tuning it for real-world image inputs.
          </li>
        </ul>

        <h2>🖥️ Back-end - Flask API</h2>
        <ul>
          <li>
            We built the back-end in <strong>Flask</strong>, a lightweight Python web framework.
          </li>
          <li>
            The trained <code>.h5</code> model is loaded on the server, which accepts image uploads, processes them, and returns predictions in real time.
          </li>
          <li>
            We added support for PlantDoctor's AI API to generate a human-friendly explanation of the diagnosis.
          </li>
        </ul>

        <h2>🌐 Front-end - React</h2>
        <ul>
          <li>
            Our front-end is built using <strong>React</strong>, designed to be modern, responsive, and user-friendly.
          </li>
          <li>
            It allows users to upload plant images, get predictions, and view interactive results with analysis, spinners, and animated transitions.
          </li>
        </ul>

        <h2>🤖 Integration with AI</h2>
        <ul>
          <li>
            After the model predicts the disease, a prompt is sent to PlantDoctorAI with the prediction and context.
          </li>
          <li>
            PlantDoctorAI then returns a scientifically grounded but understandable explanation of the problem and suggested actions.
          </li>
        </ul>

        <p>
          This combination of deep learning and generative AI offers a powerful, accurate, and accessible tool for plant health diagnosis and education.
        </p>
      </div>
    </div>
  );
}
