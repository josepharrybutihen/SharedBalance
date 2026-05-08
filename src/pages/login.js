import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import logo from "../asset/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // AUTO HIDE MESSAGE
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please fill all fields");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/users/login", { email, password });

      // SAVE TOKEN
      // ✅ extract token safely (handles different backend formats)
      const token =
        res.data.payload?.accessToken ||
        res.data.token ||
        res.data.accessToken;

      if (!token) {
        throw new Error("No token received from server");
      }

      // ✅ save token
      localStorage.setItem("token", token);

      // optional: still save user if exists
      if (res.data.payload?.account) {
        localStorage.setItem("user", JSON.stringify(res.data.payload.account));
      }

      setMessage("Login successful!");
      setMessageType("success");

      navigate("/dashboard");

    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.errorInfo?.message || "Invalid credentials");
      } else {
        setMessage("Server error. Please try again.");
      }
      setMessageType("error");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">

      <div className="login-left">
        <img src={logo} alt="logo" className="logo-img" />
        <h1>SharedBalance</h1>
        <h2>Welcome Back</h2>
        <p>Log in to continue managing your expenses</p>

        {/* ✅ MESSAGE DISPLAY */}
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="yourname@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
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