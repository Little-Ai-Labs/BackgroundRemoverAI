import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import WelcomePopup from "../components/popups/WelcomePopup";

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    if (images.length === 0) return;

    setLoading(true);
    setProcessedImages([]);

    try {
      // Simulate API call with timeout (replace with your real API call)
      const results = await Promise.all(
        images.map(
          (image) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(image);
            })
        )
      );

      // Simulate API processing delay
      setTimeout(() => {
        setProcessedImages(results);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error processing images:", error);
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Background Remover</h1>
        <p className="tagline">Transform your images effortlessly!</p>
        <blockquote className="quote">
          "A clean background is the canvas of creativity."
        </blockquote>
      </header>

      <section className="upload-section">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <button className="submit-btn" onClick={handleSubmit}>
          Remove Background
        </button>
      </section>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Processing images, please wait...</p>
        </div>
      )}

      {processedImages.length > 0 && (
        <section
          className={`results-section ${
            processedImages.length > 4 ? "scrollable" : ""
          }`}
        >
          {processedImages.map((imgSrc, index) => (
            <div key={index} className="result-card">
              <img src={imgSrc} alt={`Processed ${index}`} />
            </div>
          ))}
        </section>
      )}

      {showPopup && <WelcomePopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default Dashboard;
