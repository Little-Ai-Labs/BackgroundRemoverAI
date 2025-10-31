import React from "react";
import "../../../../styles/apps/aiFashionTryOn/Modules/AiImagesToolCard.css";
import ReactCompareImage from "react-compare-image";
import { NavLink } from "react-router-dom";

// Importing brand logos
import wholeTruthLogo from "../../../../assets/apps/aiFashionTryOn/logos/whole-truth-logo.png";
import miltonLogo from "../../../../assets/apps/aiFashionTryOn/logos/milton-logo.png";
import sheetalBatraLogo from "../../../../assets/apps/aiFashionTryOn/logos/sheetal-batra-logo.png";

// Importing icons
import magicHatIcon from "../../../../assets/apps/aiFashionTryOn/icons/magic-hat-icon.png";
import starIcon from "../../../../assets/apps/aiFashionTryOn/icons/star-icon.png";
import bookmarkIcon from "../../../../assets/apps/aiFashionTryOn/icons/bookmark-icon.png";

// Importing Images (example)
import originalImage from "../../../../assets/apps/aiFashionTryOn/images/ai-fashion-catalogue-bg-img.png";
import processedImage from "../../../../assets/apps/aiFashionTryOn/images/ai-fashion-catalogue-post-processing-img.png";

const AiImagesToolCard = (props) => {
  return (
    <div className="tool-card-container">
      <div className="brand-icons-row">
        <img className="logo" src={wholeTruthLogo} alt="Whole Truth" />
        <img className="logo" src={miltonLogo} alt="Milton" />
        <img className="logo" src={sheetalBatraLogo} alt="Sheetal Batra" />
      </div>

      <div className="tool-preview-container">
        <ReactCompareImage
          style={{
            height: "12em",
            width: "100%",
            borderRadius: "1em",
            overflow: "hidden",
          }}
          leftImage={props.originalImg}
          rightImage={props.processedImg}
          sliderPositionPercentage={0.5} // starts in the middle
        />
      </div>

      <div
        className="tool-title-and-tagline-row chat-assist"
        style={{ minHeight: "7rem" }}
      >
        <h1 className="tool-title chat-assist">{props.toolTitle}</h1>
        <p className="tool-tagline chat-assist">{props.tagLine}</p>
      </div>

      <div className="tool-description-card-chat-assist">
        <p>{props.description}</p>
      </div>

      <div className="tool-insights-card chat-assist">
        <div className="tool-insight-container">
          <img src={magicHatIcon} className="icon" alt="Magic Hat" />
          <p>250</p>
        </div>
        <div className="tool-insight-container">
          <img src={starIcon} className="icon" alt="Star" />
          <p>250</p>
        </div>
        <div className="tool-insight-container">
          <img src={bookmarkIcon} className="icon" alt="Bookmark" />
          <p>250</p>
        </div>
        <NavLink to="/home/inPaint" className="link">
          <button>Try Now</button>
        </NavLink>
      </div>
    </div>
  );
};

export default AiImagesToolCard;
