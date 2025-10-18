import "./BulkBgRemover.css";
import { useRef, useState, useEffect } from "react";

const BulkBgRemover = () => {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const uploadUrl = process.env.REACT_APP_UPLOAD_URL || null;

  // open file picker when button clicked
  const openFilePicker = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  // handle selected files
  const onFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file, idx) => {
      return {
        id: `${Date.now()}-${idx}`,
        file,
        url: URL.createObjectURL(file),
        uploadProgress: 0,
        processProgress: 0,
        selected: false,
        uploading: true,
        processing: false,
        processed: false,
      };
    });

    setImages((prev) => [...newImages, ...prev]);
  };

  // remove image
  const removeImage = (id) => {
    setImages((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found && found.url) URL.revokeObjectURL(found.url);
      return prev.filter((it) => it.id !== id);
    });
  };

  // toggle select
  const toggleSelect = (id) => {
    setImages((prev) =>
      prev.map((it) => (it.id === id ? { ...it, selected: !it.selected } : it))
    );
  };

  // simulate upload progress or perform real upload if REACT_APP_UPLOAD_URL is set
  useEffect(() => {
    const timers = [];

    images.forEach((img) => {
      if (img.uploading && img.uploadProgress < 100) {
        if (uploadUrl) {
          // example real upload flow using XHR to capture progress
          const xhr = new XMLHttpRequest();
          const fd = new FormData();
          fd.append("file", img.file);
          xhr.open("POST", uploadUrl);
          xhr.upload.onprogress = (ev) => {
            const pct = ev.lengthComputable
              ? Math.round((ev.loaded / ev.total) * 100)
              : img.uploadProgress;
            setImages((prev) =>
              prev.map((p) =>
                p.id === img.id
                  ? { ...p, uploadProgress: pct, uploading: pct < 100 }
                  : p
              )
            );
          };
          xhr.onload = () =>
            setImages((prev) =>
              prev.map((p) =>
                p.id === img.id
                  ? { ...p, uploadProgress: 100, uploading: false }
                  : p
              )
            );
          xhr.onerror = () =>
            setImages((prev) =>
              prev.map((p) =>
                p.id === img.id ? { ...p, uploading: false } : p
              )
            );
          try {
            xhr.send(fd);
          } catch (err) {
            console.warn("Upload failed", err);
            setImages((prev) =>
              prev.map((p) =>
                p.id === img.id ? { ...p, uploading: false } : p
              )
            );
          }
        } else {
          const t = setInterval(() => {
            setImages((prev) =>
              prev.map((p) => {
                if (p.id !== img.id) return p;
                const next = Math.min(
                  100,
                  p.uploadProgress + Math.floor(Math.random() * 15) + 5
                );
                return { ...p, uploadProgress: next, uploading: next < 100 };
              })
            );
          }, 500 + Math.random() * 700);
          timers.push(t);
        }
      }
    });

    return () => timers.forEach((t) => clearInterval(t));
  }, [images, uploadUrl]);

  // revoke object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    };
  }, []);

  // select all behavior
  useEffect(() => {
    setImages((prev) => prev.map((p) => ({ ...p, selected: selectAll })));
  }, [selectAll]);

  // bulk processing simulation for selected images that finished uploading
  const processSelected = () => {
    setImages((prev) =>
      prev.map((p) =>
        p.selected && p.uploadProgress === 100
          ? { ...p, processing: true, processProgress: 0 }
          : p
      )
    );

    const procTimers = [];
    images.forEach((img) => {
      if (img.selected && img.uploadProgress === 100) {
        const t = setInterval(() => {
          setImages((prev) =>
            prev.map((p) => {
              if (p.id !== img.id) return p;
              const next = Math.min(
                100,
                p.processProgress + Math.floor(Math.random() * 12) + 6
              );
              return {
                ...p,
                processProgress: next,
                processing: next < 100,
                processed: next === 100,
              };
            })
          );
        }, 600 + Math.random() * 700);
        procTimers.push(t);
      }
    });

    // fallback clear
    setTimeout(() => procTimers.forEach((t) => clearInterval(t)), 30000);
  };

  return (
    <div className="bulk-bg-remover-container">
      <h1>Bulk Background Removal</h1>
      <div className="feature-box">
        <div className="feature-description">
          <p>Remove backgrounds from hundreds of images in seconds.</p>
          <p>Upload, process and download — all in one click.</p>
          <p>Perfect for e-commerce, studios and creators.</p>
        </div>
        <div>
          <button id="upload-img-btn" onClick={openFilePicker}>
            Upload Images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={onFilesSelected}
          />
        </div>
      </div>

      {images.length > 0 && (
        <div className="thumbnail-grid">
          <div className="toolbar">
            <label className="toolbar-select">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(e) => setSelectAll(e.target.checked)}
              />{" "}
              Select all
            </label>
            <button
              className="bulk-btn"
              onClick={processSelected}
              aria-label="Remove Bulk Background"
            >
              Remove Bulk Background
            </button>
          </div>

          {images.map((img) => (
            <div className="thumb-card" key={img.id}>
              <div className="thumb-image-wrapper">
                <img
                  src={img.url}
                  alt={img.file.name || "uploaded image"}
                  className={`thumb-image ${
                    img.uploadProgress < 100 && !img.processed ? "blurred" : ""
                  }`}
                />

                {/* (Removed checkerboard overlay and split divider - show full image only) */}

                {/* actions */}
                <button
                  className="delete-btn"
                  onClick={() => removeImage(img.id)}
                  title="Delete"
                >
                  🗑
                </button>

                <label className="select-box">
                  <input
                    type="checkbox"
                    checked={img.selected}
                    onChange={() => toggleSelect(img.id)}
                  />
                </label>

                {/* progress overlay: if processing show processProgress else uploadProgress */}
                <div className="progress-overlay">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          img.processing || img.processed
                            ? img.processProgress
                            : img.uploadProgress
                        }%`,
                      }}
                    />
                  </div>
                  <div className="progress-text">
                    {img.processing || img.processed
                      ? `${img.processProgress} % Processed`
                      : `${img.uploadProgress} % Uploaded`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BulkBgRemover;
