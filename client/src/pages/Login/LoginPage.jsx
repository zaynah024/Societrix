import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, setUserType } from "../../features/Authentication/authenticatorSlice.mjs";
import hide from '../../assets/hide.png';
import show from '../../assets/show.png';
import logo from '../../assets/logo.png';
import axios from "axios";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

 const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/login/", { email, password, role }); // Corrected API endpoint
      const { token, user } = response.data;

      // Store token and user details in localStorage
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_email", user.email);
      localStorage.setItem("user_name", user.name);
      localStorage.setItem("user_role", user.role);

      // Dispatch Redux actions
      dispatch(login({ user, userType: role.toLowerCase() }));

      // Navigate to appropriate dashboard
      if (role === "Admin") {
        navigate("/dashboard");
      } else {
        navigate("/change-password");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Login failed.");
      } else {
        setError("Unable to connect to the server. Please try again later.");
      }
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
          <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
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

        {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

        <button className="login-button" onClick={handleLogin}>Log In</button>
      </div>
    </div>
  );
}