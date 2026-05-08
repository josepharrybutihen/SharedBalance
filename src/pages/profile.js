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

  const [showModal, setShowModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
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
        firstName: res.data.payload.firstName || "",
        lastName: res.data.payload.lastName || "",
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

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const updatePassword = async () => {

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    setMessage("Passwords do not match");
    setMessageType("error");
    return;
  }

  try {
    await API.put("/users/update", {
      ...user,
      password: passwordData.newPassword
    });

    setMessage("Password updated successfully!");
    setMessageType("success");

    setShowModal(false);
    setPasswordData({ newPassword: "", confirmPassword: "" });

  } catch {
    setMessage("Failed to update password");
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
              <h2>{user.firstName} {user.lastName}</h2>
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
              <label>First Name</label>
              <input
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Last Name</label>
              <input
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Email Address</label>
              <input
                name="email"
                value={user.email}
                readOnly
                className="readonly-input"
              />
            </div>

            <div>
            <label>&nbsp;</label>
            <button
              className="change-password-btn"
              onClick={() => setShowModal(true)}
            >
              Change Password
            </button>
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

      {showModal && (
  <div className="modal-overlay">
    <div className="modal">

      <h3>Change Password</h3>

      <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        value={passwordData.newPassword}
        onChange={handlePasswordChange}
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={passwordData.confirmPassword}
        onChange={handlePasswordChange}
      />

      <div className="modal-buttons">
        <button className="confirm-btn" onClick={updatePassword}>
          Confirm
        </button>

        <button
          className="cancel-btn"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}

    </>
  );
}

export default Profile;