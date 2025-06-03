// components/Settings.js
import React, { useState } from 'react';
import './Settings.css';
import { useCookies } from 'react-cookie';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons

const Settings = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cookies] = useCookies(['session_id', 'SSIDCE']);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength check
  const passwordValidationMessage = () => {
    if (newPassword.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(newPassword)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(newPassword)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(newPassword)) {
      return 'Password must contain at least one number.';
    }
    if (!/[\W_]/.test(newPassword)) {
      return 'Password must contain at least one special character.';
    }
    if (newPassword !== confirmPassword) {
      return 'New password and confirmation do not match.';
    }
    return '';
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const validationMessage = passwordValidationMessage();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/change-password`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`, // Add Authorization header
        },
        body: JSON.stringify({ 
          email_id: cookies.SSIDCE, 
          old_password: oldPassword, 
          new_password: newPassword 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password. Please try again later.');
    }
  };

  return (
    <div className="settings-page">
      <h2>User Settings</h2>
      <p>Email: <strong>{cookies.SSIDCE}</strong></p> {/* Display user's email */}
      
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div className="setting-form-group">
          <label>Old Password:</label>
          <div className="input-group">
            <input
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <div 
              className="toggle-password" 
              onClick={() => setShowOldPassword(!showOldPassword)}
              role="button"
              tabIndex="0"
              onKeyPress={(e) => e.key === 'Enter' && setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        </div>

        <div className="setting-form-group">
          <label>New Password:</label>
          <div className="input-group">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <div 
              className="toggle-password" 
              onClick={() => setShowNewPassword(!showNewPassword)}
              role="button"
              tabIndex="0"
              onKeyPress={(e) => e.key === 'Enter' && setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <small>{passwordValidationMessage()}</small> {/* Display password validation message */}
        </div>

        <div className="setting-form-group">
          <label>Confirm New Password:</label>
          <div className="input-group">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div 
              className="toggle-password" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              role="button"
              tabIndex="0"
              onKeyPress={(e) => e.key === 'Enter' && setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        </div>

        <button type="submit">Change Password</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Settings; // Corrected spelling from "defalt" to "default"
