import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, setUserType } from "../../features/Authentication/authenticatorSlice.mjs";
import hide from '../../assets/hide.png';
import check from '../../assets/check.png';
import show from '../../assets/show.png';
import logo from '../../assets/logo.png';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    // Create user object for Redux
    const userData = {
      email: email,
      name: email.split("@")[0] || (role === "Admin" ? "Admin User" : "Society User")
    };

    if (role === "Society") {
      // For society role, still use the original navigation
      dispatch(setUserType("society"));
      navigate("/change-password");
    } else {
      // Set local storage as before
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_name", email.split("@")[0] || "Admin User");
      localStorage.setItem("auth", "true");
      
      // Dispatch Redux actions
      dispatch(login({
        user: userData,
        userType: role.toLowerCase() // convert "Admin" to "admin"
      }));
      
      // Call original onLogin prop if provided
      if (onLogin) {
        onLogin();
      }
      
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img className="logo" src={logo} alt="Logo" />
        <div className="welcome">Welcome to Societrix</div>

        <div className="input-group">
          <input 
            type="text" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Admin</option>
            <option>Society</option>
          </select>
        </div>

        <div className="input-group">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <img 
            src={showPassword ? show : hide} 
            alt="Toggle visibility" 
            className="icon" 
            onClick={() => setShowPassword(!showPassword)} 
          />
        </div>

        <div className="remember-forgot">
          <div className="remember" onClick={() => setRememberMe(!rememberMe)}>
            <div className="checkbox">{rememberMe && <img src={check} alt="✔" />}</div>
            <span>Remember me</span>
          </div>
          <div className="forgot">Forgot password?</div>
        </div>

        {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

        <button className="login-button" onClick={handleLogin}>Log In</button>
      </div>
    </div>
  );
}
