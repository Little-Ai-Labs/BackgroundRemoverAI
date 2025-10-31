import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import WelcomePopup from "../components/popups/WelcomePopup";
import sample1 from "../assets/sample-1.png";
import sample2 from "../assets/sample-2.png";
import sample3 from "../assets/sample-3.png";
import sample4 from "../assets/sample-4.png";
import sample5 from "../assets/sample-5.png";

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef(null);
  const [isProcessingSample, setIsProcessingSample] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      // First check localStorage to avoid unnecessary API calls
      const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
      if (hasSeenWelcome === "true") {
        return; // User has already seen the welcome popup
      }

      try {
        // Only make API call if localStorage doesn't have the status
        const response = await fetch("/api/user/check-first-time", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.isFirstTime) {
          const timer = setTimeout(() => {
            setShowPopup(true);
            // Mark first-time status in both backend and localStorage
            localStorage.setItem("hasSeenWelcome", "true");
            fetch("/api/user/mark-welcomed", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            });
          }, 1000);

          return () => clearTimeout(timer);
        } else {
          // If backend says user is not first time, update localStorage
          localStorage.setItem("hasSeenWelcome", "true");
        }
      } catch (error) {
        console.error("Error checking first-time user status:", error);
      }
    };

    checkFirstTimeUser();
  }, []);

  // Trigger the hidden file input when user clicks Upload Image
  const onUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Handle file selection: read file as DataURL and navigate to Editor with the image
  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      const originalDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      // Navigate to Editor immediately and pass the original image. Editor will handle
      // displaying a placeholder or calling the backend later if needed.
      navigate("/editor", { state: { images: [originalDataUrl] } });
    } catch (err) {
      console.error("Failed to read file", err);
      alert("Could not read the selected file. Please try a different image.");
    } finally {
      // reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  // When a sample image is clicked, send it to the backend and navigate to Editor
  const handleSampleClick = async (src) => {
    if (!src) return;
    try {
      setIsProcessingSample(true);

      // Fetch the asset as a blob
      const res = await fetch(src);
      const blob = await res.blob();

      const formData = new FormData();
      // Use a generic filename for the sample
      formData.append("image", blob, "sample.png");

      // POST to backend processing endpoint (adjust path as needed)
      const response = await fetch("/api/process-image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to process sample image");
      }

      const processedBlob = await response.blob();

      // Convert processed blob to data URL so it survives navigation
      const processedDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(processedBlob);
      });

      // Navigate to Editor with both original and processed image
      navigate("/editor", {
        state: { images: [src], processedImage: processedDataUrl },
      });
    } catch (err) {
      console.error("Error processing sample image:", err);
      // fallback: navigate with just the original image so Editor can handle processing
      navigate("/editor", { state: { images: [src] } });
    } finally {
      setIsProcessingSample(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-container__header">
        <h1>Remove</h1>
        <h1>Image Background</h1>
        <p className="dashboard-container__header--tagline">
          Automatically erase backgrounds and highlight the subject of your
          images in a few simple steps. Quick, easy and professional results!
        </p>
      </header>
      <div className="dashboard-container__upload-section">
        {/* Hidden file input used for uploading images */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <button
          onClick={onUploadClick}
          style={{ minWidth: "60px" }}
          className="dashboard-container__upload-section--upload-image-btn"
        >
          Upload Image
        </button>
        <div className="dashboard-container__upload-section--info-text">
          <p>Supported formats: png|jpeg|jpg|webp|heic</p>
          <p>Drop an image or paste URL (upto resolution 10000 x 10000 px)</p>
          <p>
            By uploading an image or URL you agree to our{" "}
            <span>
              <a href="#">Terms of Use</a>
            </span>{" "}
            and{" "}
            <span>
              <a href="#">Privacy Policy</a>
            </span>
          </p>
        </div>
      </div>
      <p className="dashboard-container--no-images-text">
        No images? Try these images
      </p>{" "}
      <div className="dashboard-container__sample-images-row">
        <img
          src={sample1}
          alt="sample-1"
          className="dashboard-container__sample-images-row--sample-thumb"
          style={{ cursor: isProcessingSample ? "wait" : "pointer" }}
          onClick={() => !isProcessingSample && handleSampleClick(sample1)}
        />
        <img
          src={sample2}
          alt="sample-2"
          className="dashboard-container__sample-images-row--sample-thumb"
          style={{ cursor: isProcessingSample ? "wait" : "pointer" }}
          onClick={() => !isProcessingSample && handleSampleClick(sample2)}
        />
        <img
          src={sample3}
          alt="sample-3"
          className="dashboard-container__sample-images-row--sample-thumb"
          style={{ cursor: isProcessingSample ? "wait" : "pointer" }}
          onClick={() => !isProcessingSample && handleSampleClick(sample3)}
        />
        <img
          src={sample4}
          alt="sample-4"
          className="dashboard-container__sample-images-row--sample-thumb"
          style={{ cursor: isProcessingSample ? "wait" : "pointer" }}
          onClick={() => !isProcessingSample && handleSampleClick(sample4)}
        />
        <img
          src={sample5}
          alt="sample-5"
          className="dashboard-container__sample-images-row--sample-thumb"
          style={{ cursor: isProcessingSample ? "wait" : "pointer" }}
          onClick={() => !isProcessingSample && handleSampleClick(sample5)}
        />
      </div>
      {showPopup && <WelcomePopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default Dashboard;
