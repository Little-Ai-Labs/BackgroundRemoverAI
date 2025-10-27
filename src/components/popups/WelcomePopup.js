import "./WelcomePopup.css";
import tokenIcon from "../../assets/token_icon.png";

const WelcomePopup = ({ onClose }) => {
  return (
    <div className="welcome-popup-overlay">
      <img src={tokenIcon} alt="Token Icon" className="token-icon" />
      <p className="pop-up-close-btn" onClick={onClose}>
        x
      </p>
      <div className="welcome-popup-header">
        <p id="credit-info" className="welcome-popup-text bold-text">
          3 Credits
        </p>
        <p id="greeting" className="bold-text">
          Welcome to removebg.world
        </p>
      </div>
      <p className="welcome-popup-text bold-text">🎉 Congratulations 🎉</p>
      <div className="welcome-popup-body">
        <p>Your signup is complete,</p>
        <p>and you have earned exclusive signup credits as our</p>
        <p>warm welcome gift. Use them wisely. Great things await.</p>
        <p>👇⏳💼</p>
      </div>
      <p id="credit-balance-heading">YOUR CREDITS BALANCE</p>
      <div class="progress-container">
        <div class="progress-bar">
          <span class="progress-value">3</span>
        </div>
        <div class="progress-labels">
          <span>0</span>
          <span>500</span>
          <span>1000</span>
          <span>2000</span>
        </div>
      </div>
      <p>Terms of purchase</p>
      <div className="terms-of-purchase">
        <p>Credits valid for new users only</p>
        <p>Must be used within 30 days</p>
        <p>Non-Transferable & Non-Refundable</p>
      </div>
      <button onClick={onClose}>Go to Dashboard</button>
    </div>
  );
};

export default WelcomePopup;
