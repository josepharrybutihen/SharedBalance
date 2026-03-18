import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../services/supabase";
import logo from "../asset/logo.png";


function Profile() {

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
  });

  const loadProfile = async () => {
    try {
      console.log("Token from localStorage:", localStorage.getItem("token"));
      const res = await API.get("/users/profile");

      setUser({
        fullName: res.data.payload.fullName || "",
        email: res.data.payload.email || "",
        password: "",
        confirmPassword: "",
        profileImage: res.data.payload.profileImage || ""
      });

    } catch (err) {
      console.error("Failed to load profile");
    }
  };

  useEffect(() => {
  if (message) {
    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [message]);

   useEffect(() => {
  loadProfile();
}, []);

  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("profile-images")
    .upload(fileName, file);

  if (error) {
  setMessage("Image upload failed");
  setMessageType("error");
  console.log(error);
  return;
  }

  // GET PUBLIC URL
  const { data: publicUrlData } = supabase.storage
    .from("profile-images")
    .getPublicUrl(fileName);

  const imageUrl = publicUrlData.publicUrl;

  // SAVE TO BACKEND DATABASE
  try {
    await API.put("/users/update", {
      ...user,
      profileImage: imageUrl
    });

    setUser(prev => ({
      ...prev,
      profileImage: imageUrl
    }));

  setMessage("Profile photo updated!");
  setMessageType("success");

  } catch {
  setMessage("Failed to save image");
  setMessageType("error");
}
};


  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {

  if (user.password !== user.confirmPassword) {
    setMessage("Passwords do not match");
    setMessageType("error");
    return;
  }

  try {
    await API.put("/users/update", user);

    setMessage("Profile updated successfully!");
    setMessageType("success");

  } catch {
    setMessage("Update failed. Please try again.");
    setMessageType("error");
  }
  };

  const discardChanges = () => {
    loadProfile();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>

      {/* NAVBAR */}
      <div className="navbar">
        <img src={logo} alt="logo" className="logo-img"/>
        <h2>SharedBalance</h2>

        <div className="menu">

          <span
            className={location.pathname === "/expenses" ? "active" : ""}
            onClick={() => navigate("/expenses")}
          >
            Expenses
          </span>

          <span
            className={location.pathname === "/history" ? "active" : ""}
            onClick={() => navigate("/history")}
          >
            History
          </span>

          <span
            className={location.pathname === "/profile" ? "active" : ""}
            onClick={() => navigate("/profile")}
          >
            Account
          </span>

        </div>
      </div>

      <div className="profile-container">

        {/* SIDEBAR */}
        <div className="sidebar">

          <div className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back
          </div>

          <div className="menu-item active" onClick={() => navigate("/profile")} >Profile</div>
          <div className="menu-item" onClick={() => navigate("/settings")} >Settings</div>

          <button className="logout-btn" onClick={logout}>
            Log Out
          </button>

        </div>

        {/* PROFILE CARD */}
        <div className="profile-card">
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
          <div className="profile-header">

          <img
            className="avatar"
            src={
              user.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
          />

            <div>
              <h2>{user.fullName}</h2>
              <p>{user.email}</p>
              <input
              type="file"
              id="fileUpload"
              hidden
              onChange={handleImageUpload}
              />

            <button
              className="edit-photo"
              onClick={() => document.getElementById("fileUpload").click()}
              >
              Edit Photo
            </button>
            </div>

          </div>

          <div className="form-grid">

            <div>
              <label>Name</label>
              <input
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                placeholder="Edit username"
              />
            </div>

            <div>
              <label>Email Address</label>
              <input
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Edit email address"
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Change password"
              />
            </div>

            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            </div>

          </div>

          <div className="profile-buttons">

            <button
              className="discard-btn"
              onClick={discardChanges}
            >
              Discard Changes
            </button>

            <button
              className="save-btn"
              onClick={saveChanges}
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>

    </>
  );
}

export default Profile;