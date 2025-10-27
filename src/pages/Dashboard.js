import React, { useState, useRef } from "react"; // 👈 Import useRef
import "./Dashboard.css";
// Sample assets (imported for bundlers)
import sample1 from "../assets/logo.png";
import sample2 from "../assets/remove-bg-icon.png";
import sample3 from "../assets/invite-friends-img.png";
import sample4 from "../assets/user-profile-icon.png";
import sample5 from "../assets/credits-icon.png";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
  setImages(Array.from(e.target.files));
 };

  // 👈 Function to trigger the hidden file input
  const handleChooseFilesClick = () => {
  fileInputRef.current.click();
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
   await new Promise((r) => setTimeout(r, 600));
   setProcessedImages(results);
   setLoading(false);
   return results;
  } catch (err) {
   console.error("Error while processing files:", err);
   setLoading(false);
  }
 };

 const navigate = useNavigate();

 const handleSubmit = async () => {
  console.log("handleSubmit called - images:", images);
  if (images.length === 0) {
   // Same logic as before if no files are selected
   if (processedImages && processedImages.length > 0) {
    console.log("No new images but processedImages present, navigating with them.");
    navigate("/editor", { state: { images: processedImages } });
   } else {
    console.log("No images to process.");
    // Optional: Add a simple toast/alert that says "Please select an image first."
   }
   return;
  }

  const results = await processFiles(images);
  console.log("processFiles results:", results);
  if (results && results.length > 0) {
   navigate("/editor", { state: { images: results } });
  }
 };

 // Load a sample image (bundled asset) and process it as if uploaded
 const handleSampleClick = async (assetSrc) => {
  try {
   // fetch the asset as blob then convert to File-like object
   const res = await fetch(assetSrc);
   const blob = await res.blob();
   const file = new File([blob], "sample.jpg", { type: blob.type });
   const results = await processFiles([file]);
   if (results && results.length > 0) {
    navigate("/editor", { state: { images: results } });
   }
  } catch (err) {
   console.error("Error loading sample image:", err);
  }
 };

  // Helper to display file name(s) or placeholder text
 const getFileNames = () => {
  if (images.length === 1) {
   return images[0].name;
  } else if (images.length > 1) {
   return `${images.length} files chosen`;
  }
  return "No file chosen";
 };


 return (
  <div className="dashboard-container">
   <header className="dashboard-header">
    <h1>Remove Image Background</h1>
    <p className="tagline">Automatically erase backgrounds and highlight the subject of your images
in a few simple steps. Quick, easy and professional results!</p>
   </header>

   <div className="upload-section">
    {/* 👈 Hidden file input element */}
    <input
     type="file"
     multiple
     accept="image/*"
     onChange={handleFileChange}
     className="file-input-hidden" // 👈 Changed class
     ref={fileInputRef} // 👈 Attach ref
    />

    {/* 👈 Custom 'Choose Files' button */}
    <div className="custom-file-upload">
     <button className="choose-files-btn" onClick={handleChooseFilesClick}>
      Choose Files
     </button>
     <span className="file-name-display">{getFileNames()}</span>
    </div>


    {/* 👈 Updated info text block */}
    <div className="upload-info-text">
     <p>Drop an image or paste URL (upto resolution 10000 x 10000 px)</p>
     <p>Supported formats: png, jpeg, jpg, webp, heic</p>
     <p>By uploading an image or URL you agree to our <a href="#">Terms of Use</a> and <a href="#">Privacy Policy.</a></p>
    </div>

    {/* 👈 Main 'Remove Background' button */}
    <button className="submit-btn" onClick={handleSubmit}>
     Remove Background
    </button>
   </div>

   <p className="no-images-text">No images? Try these images</p> {/* 👈 New class name for consistency */}

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

  </div>
 );
};

export default Dashboard;
