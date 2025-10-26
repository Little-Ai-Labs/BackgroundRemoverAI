import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import WelcomePopup from "../components/popups/WelcomePopup";

// Sample assets (imported for bundlers)
import sample1 from "../assets/logo.png";
import sample2 from "../assets/remove-bg-icon.png";
import sample3 from "../assets/invite-friends-img.png";
import sample4 from "../assets/user-profile-icon.png";
import sample5 from "../assets/credits-icon.png";

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

  // Centralized processing helper: accepts File[] or Blob[] and sets processedImages
  const processFiles = async (fileList) => {
    const files = Array.from(fileList);
    setLoading(true);
    setProcessedImages([]);

    try {
      const results = await Promise.all(
        files.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            })
        )
      );

      // small artificial delay for UX consistency
      setTimeout(() => {
        setProcessedImages(results);
        setLoading(false);
      }, 600);
    } catch (err) {
      console.error("Error while processing files:", err);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (images.length === 0) return;
    await processFiles(images);
  };

  // Load a sample image (bundled asset) and process it as if uploaded
  const handleSampleClick = async (assetSrc) => {
    try {
      // fetch the asset as blob then convert to File-like object
      const res = await fetch(assetSrc);
      const blob = await res.blob();
      const file = new File([blob], "sample.jpg", { type: blob.type });
      await processFiles([file]);
    } catch (err) {
      console.error("Error loading sample image:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Remove Image Background</h1>
        <p className="tagline">Automatically erase backgrounds and highlight the subject of your images
in a few simple steps. Quick, easy and professional results!</p>
      </header>

      <div className="upload-section">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <p>Drop an image or paste URL (upto resolution 10000 x 10000 px)
Supported formats:png|jpeg|jpg|webp|heic
By uploading an image or URL you agree to our Terms of Use and Privacy Policy. </p>
        <button className="submit-btn" onClick={handleSubmit}>
          Remove Background
        </button>
      </div>
      <p className="dashboard-para">No images? Try these images</p>
      <div className="sample-images-row">
        {/* Using bundled assets as clickable samples */}
        <img src={sample1} alt="sample-1" className="sample-thumb" onClick={() => handleSampleClick(sample1)} />
        <img src={sample2} alt="sample-2" className="sample-thumb" onClick={() => handleSampleClick(sample2)} />
        <img src={sample3} alt="sample-3" className="sample-thumb" onClick={() => handleSampleClick(sample3)} />
        <img src={sample4} alt="sample-4" className="sample-thumb" onClick={() => handleSampleClick(sample4)} />
        <img src={sample5} alt="sample-5" className="sample-thumb" onClick={() => handleSampleClick(sample5)} />
      </div>

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
