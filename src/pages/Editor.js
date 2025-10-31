import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Editor.css";
import ReactCompareImage from "react-compare-image";
import dummyIcon from "../assets/settings-icon.png";
import plusIcon from "../assets/plus-icon.png";
import sample1 from "../assets/sample-1.png";
import sample2 from "../assets/sample-2.png";
import sample3 from "../assets/sample-3.png";
import sample4 from "../assets/sample-4.png";
import sample5 from "../assets/sample-5.png";

const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [showAllGenerations, setShowAllGenerations] = useState(false);

  useEffect(() => {
    const imgs = (location && location.state && location.state.images) || [];
    setImages(imgs);

    // If Dashboard provided a processed image (data URL), use it directly
    const preProcessed =
      (location && location.state && location.state.processedImage) || null;
    if (preProcessed) {
      setShowAllGenerations(false);
      setProcessedImage(preProcessed);
    }
  }, [location]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const originalImg = images && images.length > 0 ? images[0] : null;
  const [generations, setGenerations] = useState([]);
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const modalGridRef = useRef(null);
  const fileInputRef = useRef(null);
  const SCROLL_STEP = 128; // pixels to scroll per arrow click (approx column width + gap)

  const scrollModalGrid = (direction) => {
    if (!modalGridRef.current) return;
    const el = modalGridRef.current;
    const offset = direction === "right" ? SCROLL_STEP : -SCROLL_STEP;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  useEffect(() => {
    const processImage = async () => {
      // if (!originalImg) return;

      // // If we already have a processed image (passed from Dashboard), don't re-process
      // if (processedImage) return;

      // setIsLoading(true);
      // try {
      //   // Simulate API call by returning the original image after a delay
      //   await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay to simulate processing

      //   // Convert base64 or URL to blob
      //   const response = await fetch(originalImg);
      //   const result = await response.blob();
      //   setProcessedImage(URL.createObjectURL(result));
      // } catch (error) {
      //   console.error("Error processing image:", error);
      //   setError("Failed to process image. Please try again.");
      //   setCountdown(3);
      // } finally {
      //   setIsLoading(false);
      // }

      if (!originalImg) return;

      // If we already have a processed image (passed from Dashboard), don't re-process
      if (processedImage) return;

      setIsLoading(true);
      try {
        // Simulate API call by returning the original image after a delay
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay to simulate processing

        // For testing, simulate API returning the original image directly
        setProcessedImage(originalImg);
      } catch (error) {
        console.error("Error processing image:", error);
        // show the actual error message when possible and avoid auto-redirect for testing
        setError(
          (error && error.message) ||
            "Failed to process image. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    processImage();
  }, [originalImg, processedImage]);

  useEffect(() => {
    // Mock API: load locally available sample images as "generated" history
    const fetchHistory = async () => {
      // simulate network latency
      await new Promise((r) => setTimeout(r, 400));
      const items = [
        { id: 1, input_url: sample1, output_url: sample1 },
        { id: 2, input_url: sample2, output_url: sample2 },
        { id: 3, input_url: sample3, output_url: sample3 },
        { id: 4, input_url: sample4, output_url: sample4 },
        { id: 5, input_url: sample5, output_url: sample5 },
      ];
      setGenerations(items);
    };

    fetchHistory();
  }, []);

  return (
    <div className="editor-page">
      <div className="editor-page__result-container">
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Processing image...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">❌</div>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button
                className="retry-btn"
                onClick={() => {
                  // clear error and re-run processing
                  setError(null);
                  setProcessedImage(null);
                }}
              >
                Retry
              </button>
              <button className="back-btn" onClick={() => navigate("/")}>
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : processedImage && originalImg ? (
          <ReactCompareImage
            style={{
              height: "100%",
              width: "100%",
              borderRadius: "1em",
              overflow: "hidden",
            }}
            leftImage={
              selectedGeneration ? selectedGeneration.input_url : originalImg
            }
            rightImage={
              selectedGeneration
                ? selectedGeneration.output_url
                : processedImage
            }
            /* Use the library's per-image css props to ensure images are contained */
            leftImageCss={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              display: "block",
            }}
            rightImageCss={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              display: "block",
            }}
            sliderPositionPercentage={0.5}
          />
        ) : null}
      </div>
      <div className="editor-page__editing-tools-container">
        <div className="editor-page__editing-tools-container__tools-area">
          <p>Edit your image by adding new background image or color</p>
          <div className="editor-page__editing-tools-container__tools-area__tool-options">
            <div className="editor-page__editing-tools-container__tools-area__tool-options--option">
              <img src={dummyIcon} />
              <p>Background</p>
            </div>
            <div className="editor-page__editing-tools-container__tools-area__tool-options--option">
              <img src={dummyIcon} />
              <p>Shadow</p>
            </div>
            <div className="editor-page__editing-tools-container__tools-area__tool-options--option">
              <img src={dummyIcon} />
              <p>Adjust</p>
            </div>
            <div className="editor-page__editing-tools-container__tools-area__tool-options--option">
              <img src={dummyIcon} />
              <p>Erase</p>
            </div>
          </div>
        </div>
        <button
          className="download-btn"
          onClick={async () => {
            // handle download
            // Prefer the selected generation's output image if present,
            // then the processed image, then the original uploaded image.
            const toDownload =
              (selectedGeneration && selectedGeneration.output_url) ||
              processedImage ||
              originalImg;
            if (!toDownload) return;

            try {
              // If the image is an object URL (starts with blob:), just use it
              if (
                toDownload.startsWith("blob:") ||
                toDownload.startsWith("data:")
              ) {
                const a = document.createElement("a");
                a.href = toDownload;
                a.download = "bg-removed.png";
                document.body.appendChild(a);
                a.click();
                a.remove();
                return;
              }

              // Otherwise fetch the resource and download as blob
              const resp = await fetch(toDownload);
              const blob = await resp.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              // try to infer extension from blob type
              const ext = (blob.type && blob.type.split("/")[1]) || "png";
              a.download = `bg-removed.${ext}`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              // release URL after a short delay
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            } catch (err) {
              console.error("Download failed", err);
              alert("Failed to download image. Please try again.");
            }
          }}
          disabled={
            !(
              (selectedGeneration && selectedGeneration.output_url) ||
              processedImage ||
              originalImg
            )
          }
        >
          Download
        </button>
      </div>
      <div className="editor-page__generations-history-container">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={async (e) => {
              const file = e.target.files && e.target.files[0];
              if (!file) return;

              try {
                const dataUrl = await new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = (err) => reject(err);
                  reader.readAsDataURL(file);
                });

                // Load the uploaded image into the editor. Clear any previously
                // selected generation and any processed image so the processing
                // effect can run against the new original image.
                setSelectedGeneration(null);
                setImages([dataUrl]);
                setProcessedImage(null);
              } catch (err) {
                console.error("Failed to read uploaded file", err);
                setError(
                  "Could not read the selected file. Please try a different image."
                );
                // keep the file input usable for the same file again
              } finally {
                if (fileInputRef.current) fileInputRef.current.value = null;
              }
            }}
          />

          <div
            className="editor-page__generations-history-item editor-page__generations-history-item--add"
            onClick={() => {
              // open file picker to add a new image to editor
              if (fileInputRef.current) fileInputRef.current.click();
            }}
            title="Add new"
          >
            <div className="editor-page__generations-history-item--image-wrapper">
              <img src={plusIcon} alt="Add" />
            </div>
          </div>
        </div>

        {/* show only first 3 thumbnails by default */}
        {!showAllGenerations &&
          generations.slice(0, 3).map((g) => (
            <div
              key={g.id}
              className={`editor-page__generations-history-item ${
                selectedGeneration && selectedGeneration.id === g.id
                  ? "selected"
                  : ""
              }`}
              onClick={() => setSelectedGeneration(g)}
              title={`View generation ${g.id}`}
            >
              <img src={g.input_url} alt={`gen-${g.id}`} />
            </div>
          ))}

        {!showAllGenerations && generations.length > 3 ? (
          <div
            className="editor-page__generations-more"
            onClick={() => setShowAllGenerations(true)}
            role="button"
            tabIndex={0}
          >
            More
          </div>
        ) : null}

        {showAllGenerations ? (
          <div className="editor-page__generations-modal">
            <button
              className="editor-page__generations-modal-close"
              onClick={() => setShowAllGenerations(false)}
              aria-label="Close generations"
            >
              ×
            </button>
            <div
              className="editor-page__generations-modal-grid"
              ref={modalGridRef}
            >
              {generations.map((g) => (
                <div
                  key={g.id}
                  className={`editor-page__generations-modal-item ${
                    selectedGeneration && selectedGeneration.id === g.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedGeneration(g);
                    setShowAllGenerations(false);
                  }}
                  title={`View generation ${g.id}`}
                >
                  <img src={g.input_url} alt={`gen-${g.id}`} />
                </div>
              ))}
            </div>
            <button
              className="editor-page__generations-modal-arrow left"
              onClick={() => scrollModalGrid("left")}
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              className="editor-page__generations-modal-arrow right"
              onClick={() => scrollModalGrid("right")}
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Editor;
