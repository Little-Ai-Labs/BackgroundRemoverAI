import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Editor.css";

// ⚠️ IMPORTANT: These are placeholders for the Before/After images for the demo.
// Replace with actual base64 or import actual image assets if using a bundler.
// Since I can't provide full base64 here, I will use a simple placeholder image data structure
// and simulate the loading to ensure the slider functions correctly.

const SAMPLE_ORIGINAL_IMAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgNTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2OWZkZmYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyZjYyZmYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CRUZPUkUgSU1BR0U8L3RleHQ+PC9zdmc+";
const SAMPLE_PROCESSED_IMAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgNTAwIj48cGF0dGVybiBpZD0iY2hlY2tlcmJvYXJkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2NjYyIvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIyMCIgeD0iMTAiIGZpbGw9IiNmZmYiLz48L3BhdHRlcm4+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNjaGVja2VyYm9hcmQpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzQ0NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFGVEVSIElNQUdFPFRyYW5zcGFyZW50PC90ZXh0Pjwvc3ZnPg==";

// The useLocation will give us the images array from the dashboard
const initialImages = (location) => {
    const images = (location.state && location.state.images) || [];
    // If no images passed, use the generic samples for the demo
    if (images.length === 0) {
        return [
            SAMPLE_ORIGINAL_IMAGE, 
            SAMPLE_PROCESSED_IMAGE,
            SAMPLE_PROCESSED_IMAGE // Placeholder for other thumbnails
        ];
    }
    return images;
};

export default function Editor() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialLoadedImages = initialImages(location);
  const [images, setImages] = useState(initialLoadedImages);

  const originalSrc = images.length ? images[0] : null;
  // Use the first two for comparison, subsequent ones are just thumbnails
  const processedSrc = images.length > 1 ? images[1] : originalSrc; 

  const originalCanvasRef = useRef(null);
  const processedCanvasRef = useRef(null);
  const stageRef = useRef(null); 
  const fileInputRef = useRef(null); // 👈 Ref for file upload

  const [split, setSplit] = useState(50);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!originalSrc || !processedSrc) return;
    loadAndProcess(originalSrc, processedSrc);
  }, [originalSrc, processedSrc]);

  const loadAndProcess = (originalDataUrl, processedDataUrl) => {
    const originalImg = new Image();
    originalImg.crossOrigin = "anonymous";

    originalImg.onload = () => {
      const w = originalImg.width;
      const h = originalImg.height;
      const maxW = 1000; // Adjusted max width
      const scale = Math.min(1, maxW / w);
      const cw = Math.round(w * scale); 
      const ch = Math.round(h * scale);

      setImageDimensions({ width: cw, height: ch });

      // Draw Original (Before)
      const originalCanvas = originalCanvasRef.current;
      originalCanvas.width = cw;
      originalCanvas.height = ch;
      const octx = originalCanvas.getContext("2d");
      octx.clearRect(0, 0, cw, ch);
      octx.drawImage(originalImg, 0, 0, cw, ch);

      // Draw Processed (After)
      const processedImg = new Image();
      processedImg.crossOrigin = "anonymous";
      processedImg.onload = () => {
        const processedCanvas = processedCanvasRef.current;
        processedCanvas.width = cw;
        processedCanvas.height = ch;
        const pctx = processedCanvas.getContext("2d");
        pctx.clearRect(0, 0, cw, ch);
        pctx.drawImage(processedImg, 0, 0, cw, ch);
      };
      processedImg.src = processedDataUrl;
    };
    originalImg.src = originalDataUrl;
  };

  const downloadResult = () => {
    // ... download logic remains the same
    if (!processedCanvasRef.current) return;
    const canvas = processedCanvasRef.current;
    const link = document.createElement("a");
    link.download = "result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleBack = () => {
    navigate(-1);
  };

  // 👈 New: Function to handle file upload from editor (Point 2)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      // For the demo, we assume the user uploaded an 'original' image, 
      // so we use the *placeholder processed image* to show the effect.
      const newOriginalSrc = event.target.result;

      // Update the images list, putting the new image first and then the processed placeholder
      // You would replace SAMPLE_PROCESSED_IMAGE with a real API call result here.
      const newImages = [newOriginalSrc, SAMPLE_PROCESSED_IMAGE, ...images.slice(2)];
      setImages(newImages);
      loadAndProcess(newOriginalSrc, SAMPLE_PROCESSED_IMAGE);
    };
    reader.readAsDataURL(files[0]);
  };

  // 👈 Function to trigger hidden file input when '+' is clicked
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };


  // Draggable splitter handlers (Kept the same)
  useEffect(() => {
    const preventSelect = (e) => e.preventDefault();
    window.addEventListener('selectstart', preventSelect);
    return () => window.removeEventListener('selectstart', preventSelect);
  }, []);

  const startDrag = (e) => {
    e.preventDefault();
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchmove', onDrag, { passive: false });
    window.addEventListener('touchend', endDrag);
  };

  const onDrag = (e) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = stageRef.current.getBoundingClientRect(); 
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    setSplit(pct);
  };

  const endDrag = () => {
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', endDrag);
    window.removeEventListener('touchmove', onDrag);
    window.removeEventListener('touchend', endDrag);
  };

  return (
    <div className="editor-wrapper">
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        style={{ display: 'none' }} // Hidden input (Point 2)
      />

      <div className="editor-main-container">
        <div className="canvas-wrap">
          {/* Before/After Labels (Moved into main section for better positioning) */}
          <div className="compare-labels">
            <button className="label-btn">Before</button>
            <button className="label-btn active">After</button>
          </div>

          <div 
            className="canvas-stage" 
            ref={stageRef}
            style={{ 
              width: `${imageDimensions.width}px`, 
              height: `${imageDimensions.height}px` 
            }}
          >
            {/* The Before Image Canvas (Base Layer) */}
            <canvas ref={originalCanvasRef} className="original-canvas" />

            {/* The After Image Layer (Clipped by its width) */}
            <div
              className="result-overlay"
              style={{ width: `${split}%` }} // This clips the 'after' canvas
            >
              <canvas ref={processedCanvasRef} className="processed-canvas" />
            </div>

            {/* The Draggable Split Handle */}
            <div
              className="split-handle"
              style={{ left: `${split}%` }}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            >
              <div className="handle-knob" />
            </div>

          </div>

          {/* 👈 New control bar at the bottom (Point 3) */}
          <div className="control-bar-bottom">
            <p className="control-bar-note">You can edit or add image or color backgrounds to your Image here</p>
            <div className="options-group">
              <button className="tool-btn">🖼️ Background</button>
              <button className="tool-btn">⚫ Shadow</button>
              <button className="tool-btn">✨ Adjust</button>
              <button className="tool-btn">🧽 Erase</button>
            </div>
            <button className="download-btn-bottom" onClick={downloadResult}>Download</button>
          </div>
        </div>

        {/* 👈 New Sidebar structure */}
        <aside className="editor-sidebar">
          <button className="plus-btn" onClick={triggerFileInput}>
            <span className="plus-icon">+</span>
          </button>
          <div className="thumb-list">
            {images.slice(0, 3).map((src, idx) => ( // Show first 3 images
              <img 
                key={idx} 
                src={src} 
                alt={`thumb-${idx}`} 
                className="side-thumb" 
                onClick={() => loadAndProcess(images[0], images[1])} 
              />
            ))}
          </div>
        </aside>
      </div>

    </div>
  );
}

// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./Editor.css";

// export default function Editor() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const images = (location.state && location.state.images) || [];
//   const originalSrc = images.length ? images[0] : null;
//   // Use a second image if available, otherwise just use the original for demo
//   const processedSrc = images.length > 1 ? images[1] : originalSrc; 

//   const originalCanvasRef = useRef(null);
//   const processedCanvasRef = useRef(null);
//   const stageRef = useRef(null); // Reference to the canvas-stage div

//   const [split, setSplit] = useState(50); // percent for slider position
//   const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

//   useEffect(() => {
//     if (!originalSrc || !processedSrc) return;
//     loadAndProcess(originalSrc, processedSrc);
//   }, [originalSrc, processedSrc]);

//   const loadAndProcess = (originalDataUrl, processedDataUrl) => {
//     const originalImg = new Image();
//     originalImg.crossOrigin = "anonymous";

//     originalImg.onload = () => {
//       const w = originalImg.width;
//       const h = originalImg.height;
//       const maxW = 1400; // Max width for scaling
//       const scale = Math.min(1, maxW / w);
//       const cw = Math.round(w * scale); // Scaled width
//       const ch = Math.round(h * scale); // Scaled height

//       setImageDimensions({ width: cw, height: ch });

//       // Draw Original (Before)
//       const originalCanvas = originalCanvasRef.current;
//       originalCanvas.width = cw;
//       originalCanvas.height = ch;
//       const octx = originalCanvas.getContext("2d");
//       octx.clearRect(0, 0, cw, ch);
//       octx.drawImage(originalImg, 0, 0, cw, ch);

//       // Draw Processed (After)
//       const processedImg = new Image();
//       processedImg.crossOrigin = "anonymous";
//       processedImg.onload = () => {
//         const processedCanvas = processedCanvasRef.current;
//         processedCanvas.width = cw;
//         processedCanvas.height = ch;
//         const pctx = processedCanvas.getContext("2d");
//         pctx.clearRect(0, 0, cw, ch);
//         pctx.drawImage(processedImg, 0, 0, cw, ch);
//       };
//       processedImg.src = processedDataUrl;
//     };
//     originalImg.src = originalDataUrl;
//   };

//   const downloadResult = () => {
//     if (!processedCanvasRef.current) return;
//     const canvas = processedCanvasRef.current;
//     const link = document.createElement("a");
//     link.download = "result.png";
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   // Draggable splitter handlers
//   useEffect(() => {
//     const preventSelect = (e) => e.preventDefault();
//     window.addEventListener('selectstart', preventSelect);
//     return () => window.removeEventListener('selectstart', preventSelect);
//   }, []);

//   const startDrag = (e) => {
//     e.preventDefault();
//     window.addEventListener('mousemove', onDrag);
//     window.addEventListener('mouseup', endDrag);
//     window.addEventListener('touchmove', onDrag, { passive: false });
//     window.addEventListener('touchend', endDrag);
//   };

//   const onDrag = (e) => {
//     e.preventDefault();
//     const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//     const rect = stageRef.current.getBoundingClientRect(); // Get bounds of the stage div
//     let pct = ((clientX - rect.left) / rect.width) * 100;
//     pct = Math.max(0, Math.min(100, pct));
//     setSplit(pct);
//   };

//   const endDrag = () => {
//     window.removeEventListener('mousemove', onDrag);
//     window.removeEventListener('mouseup', endDrag);
//     window.removeEventListener('touchmove', onDrag);
//     window.removeEventListener('touchend', endDrag);
//   };

//   return (
//     <div className="editor-wrapper">
//       <div className="editor-topbar">
//         <button className="ghost" onClick={handleBack}>&larr; Back</button>
//         <div style={{flex:1}} />
//         <button className="download-btn" onClick={downloadResult}>Download</button>
//       </div>

//       <div className="editor-main">
//         <div className="canvas-wrap">
//           <div 
//             className="canvas-stage" 
//             ref={stageRef}
//             // Set the dimensions of the stage dynamically based on image, minus padding
//             style={{ 
//               width: `${imageDimensions.width}px`, 
//               height: `${imageDimensions.height}px` 
//             }}
//           >
//             {/* The Before Image Canvas (Base Layer) */}
//             <canvas ref={originalCanvasRef} className="original-canvas" />

//             {/* The After Image Layer (Clipped by its width) */}
//             <div
//               className="result-overlay"
//               style={{ width: `${split}%` }} // This clips the 'after' canvas
//             >
//               <canvas ref={processedCanvasRef} className="processed-canvas" />
//             </div>

//             {/* The Draggable Split Handle */}
//             <div
//               className="split-handle"
//               style={{ left: `${split}%` }}
//               onMouseDown={startDrag}
//               onTouchStart={startDrag}
//             >
//               <div className="handle-line" />
//               <div className="handle-knob" />
//             </div>

//             {/* Optional Labels */}
//             <div className="label before-label" style={{ left: '10px' }}>Before</div>
//             {/* Adjust 'After' label position to stay with the slider */}
//             <div className="label after-label" style={{ left: `${split + 1}%` }}>After</div>
//           </div>

//           <div className="editor-bottom">
//             <div className="note">Background removal is disabled. This demo shows an image comparison slider.</div>
//           </div>
//         </div>

//         <aside className="editor-sidebar">
//           <div className="thumb-list">
//             {/* When clicking thumbnails, load original and processed pair */}
//             {images.map((src, idx) => (
//               <img 
//                 key={idx} 
//                 src={src} 
//                 alt={`thumb-${idx}`} 
//                 className="side-thumb" 
//                 onClick={() => loadAndProcess(images[0], images[1] || images[0])} 
//               />
//             ))}
//           </div>
//           <div className="plus">+</div>
//         </aside>
//       </div>
//     </div>
//   );
// }
