import React, { useState, useEffect } from "react";
import "../styles/expenses.css";
import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../asset/logo.png";
import others from "../asset/others.png";

function Expenses() {
  const navigate = useNavigate();
  const location = useLocation();

  const [groups, setGroups] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
  const init = async () => {
    const res = await API.get("/users/profile");
    const email = res.data.payload.email;

    setUserEmail(email);

    const groupRes = await API.get(`/groups?email=${email}`);
    setGroups(groupRes.data.payload.reverse());
  };

  init();
  }, []);

  // ✅ Get logged-in user
  const fetchUser = async () => {
    try {
      const res = await API.get("/users/profile");
      setUserEmail(res.data.payload.email);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Fetch groups
  const fetchGroups = async (email) => {
  const res = await API.get(`/groups?email=${email}`);
  setGroups(res.data.payload.reverse());
  };


  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <img src={logo} alt="logo" className="logo-img" />
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

      <div className="expenses-container">
        <div className="expenses-header">
          <div
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ←
          </div>
          <div>
            <h1>Your Groups</h1>
            <p>Select a group to manage expenses</p>
          </div>
        </div>

        <div className="groups-list">
          {groups.length === 0 ? (
            <p>No groups available</p>
          ) : (
            groups.map((g) => {
              // ✅ Include creator + members
              const allMembers = [...new Set(g.members || [])];

              return (
                <div
                  key={g.id}
                  className="group-item clickable"
                  onClick={() => navigate(`/groups/${g.id}`)}
                >
                  <div className="group-header">
                    <img
                      className="group-photo"
                      src={g.categoryImg || others}
                      alt="group"
                    />

                    <div className="group-info">
                      <h4>{g.name}</h4>
                      <p>
                        Created by:{" "}
                        {g.creatorEmail === userEmail
                          ? "You"
                          : g.creatorName}
                      </p>
                    </div>

                    <div className="amount-owed">
                      {allMembers.length} members
                    </div>
                  </div>

                  <div className="group-members">
                    {allMembers.slice(0, 4).map((m) => (
                      <img
                        key={m}
                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        alt={m}
                        title={m}
                        className="member-avatar"
                      />
                    ))}

                    {allMembers.length > 4 && (
                      <span className="more-members">
                        +{allMembers.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default Expenses;