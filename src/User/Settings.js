import React, { useState } from 'react';
import './Settings.css';
import { useCookies } from 'react-cookie';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
  const [passwordStrength, setPasswordStrength] = useState('');

  const checkPasswordStrength = (password) => {
    if (!password) return '';
    
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[\W_]/.test(password);
    
    const strength = [
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    ].filter(Boolean).length;
    
    return `Strength: ${strength}/5`;
  };

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
          "Authorization": `Bearer ${cookies.session_id}`,
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
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password. Please try again later.');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2 className="settings-title">User Settings</h2>
        <p className="user-email">Email: <span>{cookies.SSIDCE}</span></p>
        
        <div className="password-change-section">
          <h3 className="section-title">Change Password</h3>
          <form onSubmit={handleChangePassword} className="password-form">
            <div className="form-group">
              <label htmlFor="oldPassword">Current Password</label>
              <div className="input-wrapper">
                <input
                  id="oldPassword"
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  placeholder="Enter current password"
                />
                <button 
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  aria-label={showOldPassword ? 'Hide password' : 'Show password'}
                >
                  {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordStrength(checkPasswordStrength(e.target.value));
                  }}
                  required
                  placeholder="Enter new password"
                />
                <button 
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {newPassword && (
                <div className={`password-strength ${passwordStrength.includes('5/5') ? 'strong' : 'weak'}`}>
                  {passwordStrength}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                />
                <button 
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Change Password
            </button>
          </form>

          {message && <div className="alert success">{message}</div>}
          {error && <div className="alert error">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Settings;