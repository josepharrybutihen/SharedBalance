import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../asset/logo.png";
import beach from "../asset/beach.png";
import dinner from "../asset/dinner.png";
import hotel from "../asset/hotel.png";
import party from "../asset/party.png";
import roadtrip from "../asset/roadtrip.png";
import others from "../asset/others.png";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function Dashboard() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [toPay, setToPay] = useState(0);
  const [toReceive, setToReceive] = useState(0);
  const [netBalance, setNetBalance] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const [groups, setGroups] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("beach");

  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const categoryOptions = [
    { key: "beach", img: beach },
    { key: "dinner", img: dinner },
    { key: "hotel", img: hotel },
    { key: "party", img: party },
    { key: "roadtrip", img: roadtrip },
    { key: "others", img: others },
  ];

  const categoryMap = {
    beach,
    dinner,
    hotel,
    party,
    roadtrip,
    others,
  };

  // ✅ Fetch logged-in user
  const fetchUser = async () => {
    try {
      const res = await API.get("/users/profile");
      const user = res.data.payload;

      setUserName(`${user.firstName} ${user.lastName}`);
      setUserEmail(user.email);

      return user.email;
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Fetch users (exclude self)
  const fetchUsers = async (email) => {
    try {
      const res = await API.get("/users/all");
      const filtered = res.data.payload.filter(u => u.email !== email);
      setUsers(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  const allMembers = selectedGroup
  ? [...new Set([
      selectedGroup.creatorEmail,
      ...(selectedGroup.members || [])
    ])]
  : [];

const uniqueMembers = [...new Set(allMembers)];

  // ✅ Fetch groups
  const fetchGroups = async (email) => {
  try {
    const res = await API.get(`/groups?email=${email}`);
    setGroups(res.data.payload.reverse());
  } catch (err) {
    console.log(err);
  }
  };

  // ✅ Init
  useEffect(() => {
  const init = async () => {
    const email = await fetchUser();
    if (email) {
      await fetchUsers(email);
      await fetchNotifications(); // no email needed anymore

      const res = await API.get(`/groups?email=${email}`);
      const groupList = res.data.payload;

      setGroups(groupList.reverse());
      // ✅ CALCULATE DASHBOARD VALUES
      await fetchDashboardBalance(email);
      
    }
  };
  init();
  }, []);

  useEffect(() => {
  if (location.state?.refresh) {
    refreshDashboard();
  }
  }, [location.state]);

  const fetchDashboardBalance = async (email) => {
  try {
    const res = await API.get(`/payments/balance?email=${email}`);

    setToPay(res.data.toPay || 0);
    setToReceive(res.data.toReceive || 0);
    setNetBalance(res.data.netBalance || 0);

  } catch (err) {
    console.log("Failed to fetch balance");
  }
  };

  const refreshDashboard = async () => {
  if (!userEmail) return;

  try {
    const res = await API.get(`/groups?email=${userEmail}`);
    setGroups(res.data.payload);

    await fetchDashboardBalance(userEmail);

  } catch (err) {
    console.log(err);
  }
  };

  useEffect(() => {
  if (!userEmail) return;

  const socket = new SockJS("https://sharedbalance-backend-1.onrender.com/api/v1");

  const client = new Client({
    webSocketFactory: () => socket,

    onConnect: () => {
      console.log("Connected to WebSocket");

      client.subscribe(`/topic/notifications/${userEmail}`, (message) => {
      const notifText = message.body;

      const newNotif = {
        text: notifText,
        time: new Date(),
        isRead: false
      };

      // ✅ add to notification list
      setNotifications(prev => [newNotif, ...prev]);

      // ✅ increase unread count
      setUnreadCount(prev => prev + 1);

      // ❌ remove alert (optional)
      // alert(notifText);

      // ✅ refresh dashboard
      fetchDashboardBalance(userEmail);
    });
    },

    onStompError: (frame) => {
      console.error("Broker error:", frame.headers["message"]);
    },
  });

  client.activate();

  return () => {
    client.deactivate();
  };

}, [userEmail]);

useEffect(() => {
  const handleClickOutside = () => setShowNotif(false);

  if (showNotif) {
    window.addEventListener("click", handleClickOutside);
  }

  return () => {
    window.removeEventListener("click", handleClickOutside);
  };
}, [showNotif]);

  const fetchNotifications = async () => {
  try {
    const res = await API.get(`/notifications`);
    const data = res.data || [];

    setNotifications(
      data.map(n => ({
        text: n.message,
        time: new Date(n.createdAt),
        isRead: n.read // backend uses setRead()
      }))
    );

    const unread = data.filter(n => !n.read).length;
    setUnreadCount(unread);

  } catch (err) {
    console.log("Failed to fetch notifications");
  }
};

  const openNotifications = async () => {
  setShowNotif(!showNotif);

  try {
    await API.put(`/notifications/mark-read`);
    setUnreadCount(0);
  } catch (err) {
    console.log("Failed to mark notifications as read");
  }
};


  // ✅ Toggle member
  const toggleMember = (user) => {
    const exists = selectedMembers.find(m => m.email === user.email);
    if (exists) {
      setSelectedMembers(selectedMembers.filter(m => m.email !== user.email));
    } else {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  // ✅ Open modal
  const openCreateModal = () => {
    setGroupName("");
    setDescription("");
    setSelectedMembers([]);
    setSelectedCategory("beach");
    setShowCreateModal(true);
  };

  // ✅ Create group
  const createGroup = async () => {
    if (!groupName.trim()) {
      setMessage("Group name is required");
      setMessageType("error");
      return;
    }

    if (selectedMembers.length === 0) {
      setMessage("Please select at least one member");
      setMessageType("error");
      return;
    }

    try {
      // ✅ include logged-in user automatically
      const memberEmails = [
        userEmail,
        ...selectedMembers.map(u => u.email)
      ];

      // ✅ remove duplicates
      const uniqueMembers = [...new Set(memberEmails)];

      const selectedCatImg = categoryMap[selectedCategory] || others;

      const res = await API.post("/groups/create", {
        name: groupName,
        description,
        members: uniqueMembers,
        category: selectedCategory,
        categoryImg: selectedCatImg,
        creatorName: userName,
        creatorEmail: userEmail // ✅ IMPORTANT
      });

      setMessage("Group created successfully!");
      setMessageType("success");

      setGroups(prev => [res.data.payload, ...prev]);
      setShowCreateModal(false);

    } catch (err) {
      console.log(err);
      setMessage("Group creation failed");
      setMessageType("error");
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <img src={logo} alt="logo" className="logo-img" />
        <h2>SharedBalance</h2>
        
        <div className="menu">
          <div className="notif-container">
        <span 
          className="notif-bell"
          onClick={(e) => {
            e.stopPropagation();
            openNotifications();
          }}
          >
          🔔

          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount}</span>
          )}
        </span>

        {showNotif && (
          <div className="notif-dropdown">
            {notifications.length === 0 ? (
              <p className="empty">No notifications</p>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className={`notif-item ${!n.isRead ? "unread" : ""}`}>
                  <p>{n.text}</p>
                  <span className="time">
                    {n.time.toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
          <span className={location.pathname === "/expenses" ? "active" : ""} onClick={() => navigate("/expenses")}>Expenses</span>
          <span className={location.pathname === "/history" ? "active" : ""} onClick={() => navigate("/history")}>History</span>
          <span className={location.pathname === "/profile" ? "active" : ""} onClick={() => navigate("/profile")}>Account</span>
        </div>
      </div>

      {/* DASHBOARD */}
      <div className="dashboard">
        <h2 className="welcome-text">Welcome, {userName}!</h2>

        <div className="dashboard-summary">
          <div className="card"><h3>PHP {toPay.toFixed(2)}</h3><p>To Pay</p></div>
          <div className="card"><h3>PHP {toReceive.toFixed(2)}</h3><p>Received</p></div>
          <div className="card green"><h3>PHP {netBalance.toFixed(2)}</h3><p>Net Balance</p></div>
        </div>

        <div className="groups">
          <h3>Your Groups</h3>
          <button className="create-btn" onClick={openCreateModal}>+ Create Group</button>

          {groups.map((g) => {
            const allMembers = [...new Set([
              g.creatorEmail,
              ...(g.members || [])
            ])];

            return (
              <div
                key={g.id}
                className="group-item clickable"
                onClick={() => setSelectedGroup(g)}
              >
                <div className="group-header">
                  <img className="group-photo" src={g.categoryImg || others} alt="group" />

                  <div className="group-info">
                    <h4>{g.name}</h4>
                    <p>
                      Created by: {g.creatorEmail === userEmail ? "You" : g.creatorName}
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
          })}
        </div>
      </div>

      {/* MESSAGE */}
      {message && <div className={`message ${messageType}`}>{message}</div>}

      {/* CREATE MODAL */}
      {showCreateModal && users.length > 0 && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h3>Create a group</h3>
                <p>Organize shared expenses with friends</p>
              </div>
              <span className="close-btn" onClick={() => setShowCreateModal(false)}>✕</span>
            </div>

            <div className="modal-body">
              <input placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
              <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

              <div className="user-list">
              {users.map(u => {
                const isSelected = selectedMembers.find(m => m.email === u.email);
                return (
                  <div
                    key={u.email}
                    className={`user-card ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleMember(u)}
                  >
                    {/* ✅ PROFILE IMAGE */}
                    <img
                      src={u.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt={u.firstName}
                      className="avatar"
                    />

                    <div>
                      <h4>{u.firstName} {u.lastName}</h4>
                      <p>{u.email}</p>
                    </div>
                  </div>
                );
              })}
            </div>

              <div className="categories">
              {categoryOptions.map(cat => (
                <button
                  key={cat.key}
                  className={`category-btn ${selectedCategory === cat.key ? "selected" : ""}`}
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  <div className="img-wrapper">
                    <img src={cat.img} alt={cat.key} />
                  </div>
                </button>
              ))}
            </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button onClick={createGroup}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* GROUP DETAILS MODAL */}
      {selectedGroup && (
      <div className="modal-overlay" onClick={() => setSelectedGroup(null)}>
        <div className="modal-card" onClick={e => e.stopPropagation()}>

          {/* ✅ HEADER WITH CLOSE BUTTON */}
          <div className="modal-header">
            <div>
              <h3>{selectedGroup.name}</h3>
              <p>{selectedGroup.description}</p>
            </div>
            <span 
              className="close-btn" 
              onClick={() => setSelectedGroup(null)}
            >
              ✕
            </span>
          </div>

          {/* MEMBERS */}
          <h4>Members</h4>

          
            {uniqueMembers.map((m) => (
            <div key={m} className="user-card">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt={m}
                className="avatar"
              />
              <div>
                <h4>{m === userEmail ? "You" : m}</h4>
                <p>{m}</p>
              </div>
            </div>
          ))}

        </div>
      </div>
    )}
    </>
  );
}
export default Dashboard;