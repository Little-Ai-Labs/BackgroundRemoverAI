import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountModal.css'; // Use the same CSS file for shared styles
import defaultAvatar from '../assets/default_profile.png';

// --- SUB-COMPONENTS FOR EACH TAB ---

const SubscriptionContent = () => (
    <>
        <h2>Subscription</h2>
        <div className="subscription-plan-box">
            <div className="plan-header">
                <h3>PRO PLAN - $45.48</h3>
                <span className="monthly-tag">Monthly</span>
            </div>
            <p>Current Plan</p>
            <ul>
                <li>✓ 500 Credits per month</li>
                <li>✓ Bulk Bg Remover</li>
                <li>✓ 2 GB Storage</li>
            </ul>
        </div>
        
        <div className="cancel-section">
            <p>Cancel subscription</p>
            <p className="cancel-note">Cancel the subscription of the organization. When you cancel the subscription, you will be downgraded to the free plan and lose access to the features on your paid plan.</p>
            <button className="cancel-btn">Cancel Subscription</button>
        </div>
    </>
);

const BillingContent = () => (
    <>
        <h2>Billing</h2>
        <table className="billing-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Plan</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Oct 16, 2025 16:36:05</td>
                    <td>$45.54</td>
                    <td>Credits</td>
                    <td className="status-paid">Paid</td>
                </tr>
                <tr>
                    <td>Oct 15, 2025 13:48:25</td>
                    <td>$10</td>
                    <td>Basic</td>
                    <td className="status-paid">Paid</td>
                </tr>
                <tr>
                    <td>Oct 12, 2025 11:35:45</td>
                    <td>$5</td>
                    <td>Pro</td>
                    <td className="status-failed">Failed</td>
                </tr>
            </tbody>
        </table>
    </>
);

const ProfileContent = ({ imgSrc, alt, size, handleError }) => (
    <>
        <div className="account-header-section">
            <img
                src={imgSrc}
                alt={alt || "User Profile Picture"}
                onError={handleError}
                className="profile-pic"
                style={{ '--profile-size': `${size}px` }}
            />
            <div className="user-info"> 
                <h3>Jatin Lekkala</h3>
                <h4>Pay as you go</h4>
            </div>
            <div className="credit-info-wrapper">
                <div className='credit-box'>
                    <h4>50000</h4>
                    <h5>Life time credits</h5>
                </div>
                <div className='credit-box'>
                    <h4>4500</h4>
                    <h5>Monthly credits</h5>
                </div>
            </div>
        </div>
        
        <div className="account-form-section">
            <div className="form-row"><label>First Name</label><input defaultValue="Jatin" /></div>
            <div className="form-row"><label>Last Name</label><input defaultValue="Lekkala" /></div>
            <div className="form-row"><label>Email</label><input defaultValue="jatin@example.com" /></div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}><button className="save-btn">Save Changes</button></div>
        </div>
    </>
);

const UsageHistoryContent = () => (
    <>
        <h2>Usage History</h2>
        <table className="usage-history-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Used</th>
                    <th>Status</th>
                    <th>Result</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Oct 16, 2025 16:36:05</td>
                    <td>Bg remove</td>
                    <td>1</td>
                    <td className="status-success">Success</td>
                    <td><button className="download-action">Download</button></td>
                </tr>
                <tr>
                    <td>Oct 15, 2025 13:48:25</td>
                    <td>Bulk bg</td>
                    <td>100</td>
                    <td className="status-success">Success</td>
                    <td><button className="download-action">Download</button></td>
                </tr>
                <tr>
                    <td>Oct 12, 2025 11:35:45</td>
                    <td>Bg remove</td>
                    <td>1</td>
                    <td className="status-success">Success</td>
                    <td><button className="download-action">Download</button></td>
                </tr>
            </tbody>
        </table>
    </>
);

const SettingsContent = () => (
    <>
      <h2>Change Password</h2>
      <div className="form-row"><label>Old Password</label><input type="password" /></div>
      <div className="form-row"><label>New Password</label><input type="password" /></div>
      <div className="form-row"><label>Confirm Password</label><input type="password" /></div>
      <div style={{ textAlign: 'center', marginTop: 12 }}><button className="save-btn">Save Changes</button></div>
    </>
);

// Map tab names to their components
const TabComponents = {
    'Profile': ProfileContent,
    'Subscriptions': SubscriptionContent,
    'Billing': BillingContent,
    'Usage History': UsageHistoryContent,
    'Settings': SettingsContent,
};
const TabNames = Object.keys(TabComponents);


export default function AccountModal({ open, onClose, src, alt, size = 100 }) {
    const navigate = useNavigate();
    
    // State to track the active view/tab
    const [activeTab, setActiveTab] = useState(TabNames[0]); // Default to 'Profile'

    // State and handler for profile pic fallback
    const [imgSrc, setImgSrc] = useState(src || defaultAvatar);

    const handleError = () => {
        if (imgSrc !== defaultAvatar) {
            setImgSrc(defaultAvatar);
        }
    };
    
    // Effect to prevent background scroll when modal is open
    useEffect(() => {
        if (open) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = prev;
            };
        }
    }, [open]);

    if (!open) return null;

    const CurrentContent = TabComponents[activeTab];

    return (
        <div className="account-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="account-modal" onClick={(e) => e.stopPropagation()}>
                <button className="account-close" onClick={onClose} aria-label="Close">×</button>
                <div className="account-grid">
                    
                    {/* SIDEBAR */}
                    <aside className="account-sidebar">
                        <h4>Account</h4>
                        <ul>
                            {TabNames.map((tab) => (
                                <li
                                    key={tab}
                                    className={activeTab === tab ? 'active-tab' : ''}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {/* Optional: Add icons based on tab name */}
                                    {tab}
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* MAIN CONTENT AREA (Dynamic) */}
                    <main className="account-main">
                        {/* Renders the selected tab's component */}
                        {activeTab === 'Profile' ? (
                             <ProfileContent imgSrc={imgSrc} alt={alt} size={size} handleError={handleError} />
                        ) : (
                            <CurrentContent />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
