import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import check from "src/images/check.png";
import hide from "src/images/hide.png";
import logo from "src/images/logo.png";
import show from "src/images/show.png"

export default function LoginPage({ onLogin }) {
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
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_name", email.split("@")[0] || "Admin User");
      localStorage.setItem("auth", "true");
      onLogin(); 
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
    src={showPassword ? show : hide}  // Conditionally switch between the show and hide icon
    alt="Toggle visibility" 
    className="icon" 
    onClick={() => setShowPassword(!showPassword)}  // Toggle the visibility
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
