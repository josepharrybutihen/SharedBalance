import React, { useState } from "react";
import API from "../services/api";       // axios instance or API helper
import "../styles/login.css";             // CSS import
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // error message state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/users/login", { email, password });

      // Save token and user info from response
      localStorage.setItem("token", res.data.payload.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.payload.account));

      // Navigate to dashboard after successful login
      navigate("/dashboard");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.errorInfo.message);
      } else {
        setError("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="logo">SharedBalance</h1>
        <h2>Welcome Back</h2>
        <p>Log in to continue managing your expenses</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="yourname@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Log in</button>
        </form>

        <p className="signup">
          Don't have an account? 
          <span onClick={() => navigate("/register")}> Sign up</span>
        </p>
      </div>

      <div className="login-right"></div>
    </div>
  );
}

export default Login;