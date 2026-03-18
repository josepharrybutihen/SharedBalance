import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/register.css";
import { useNavigate } from "react-router-dom";
import logo from "../asset/logo.png";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setMessage("Please fill all fields.");
      setMessageType("error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      await API.post("/users/signup", form);

      setMessage("Registration successful!");
      setMessageType("success");

      // Redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      setMessage(
        err.response?.data?.errorInfo?.message || "Registration failed."
      );
      setMessageType("error");
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      
      <div className="register-left">
        <img src={logo} alt="logo" className="logo-img" />
        <h1>Join SharedBalance <br />Community Now!</h1>
        <p>Start splitting worries, not friendship</p>
      </div>

      <div className="register-right">
        <h2>Create your account</h2>

        {/* ✅ MESSAGE DISPLAY */}
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <label>Name</label>
          <input
            name="fullName"
            type="text"
            placeholder="Enter your full name here"
            value={form.fullName}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter email address here"
            value={form.email}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="******"
            value={form.password}
            onChange={handleChange}
          />

          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="******"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-link">
          Already have an account?
          <span onClick={() => navigate("/login")}> Log in</span>
        </p>
      </div>
    </div>
  );
}

export default Register;