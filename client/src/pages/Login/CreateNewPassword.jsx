import React, { useState } from "react";
import hideIcon from "../../assets/hide.png";
import showIcon from "../../assets/show.png";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthentication, setUserType } from "../../features/Authentication/authenticatorSlice.mjs";

export const CreateNewPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      
      dispatch(setAuthentication(true));
      dispatch(setUserType("society"));
      navigate("/society-dashboard");
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
