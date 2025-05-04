import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import check from "src/assets/check.png";
import hide from "src/assets/hide.png";
import logo from "src/assets/logo.png";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
   
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    if (role === "Society") {
      navigate("/change-password"); 
    } else {
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
            src={hide} 
            alt="Hide" 
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
