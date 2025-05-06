import React, { useState } from "react";
import hideIcon from "src/images/hide.png";
import showIcon from "src/images/show.png"; 
import logo from "src/images/logo.png";


export const CreateNewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleConfirm = () => {
    if (!password || !confirmPassword) {
      alert("Please fill in both fields.");
    } else if (password !== confirmPassword) {
      alert("Passwords do not match.");
    } else {
      alert("Password changed successfully!");
    }
  };

  return (
    <div className="create-new-password">
      <div className="form-container">
        <img className="logo" alt="Logo" src={logo} />

        <h2 className="title">Create New Password</h2>

        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />
          <div className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
            <img src={showPassword ? showIcon : hideIcon} alt="Toggle visibility" />
          </div>
        </div>

        <div className="input-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="password-input"
          />
          <div className="toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            <img src={showConfirmPassword ? showIcon : hideIcon} alt="Toggle visibility" />
          </div>
        </div>

        <button className="confirm-button" onClick={handleConfirm}>
          Confirm Changes
        </button>
      </div>
    </div>
  );
};
