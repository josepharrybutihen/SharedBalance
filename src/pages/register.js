import React, { useState } from "react";
import API from "../services/api";          // Your API helper/axios instance
import "../styles/register.css";            // CSS import
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await API.post("/users/signup", form);

      // Optionally save token or user info here if returned by your API
      console.log(res.data);
      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.errorInfo?.message || "Registration failed.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1>Join SharedBalance Community Now!</h1>
        <p>Start splitting worries, not friendship</p>
      </div>

      <div className="register-right">
        <h2>Create your account</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleRegister}>
          <label>Name</label>
          <input
            name="fullName"
            type="text"
            placeholder="Enter your full name here"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter email address here"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="******"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="******"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>

        <p className="login-link">
          Already have an account?
          <span onClick={() => navigate("/")}> Log in</span>
        </p>
      </div>
    </div>
  );
}

export default Register;