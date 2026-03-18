import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../asset/logo.png";

function Dashboard() {

  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [groups,setGroups] = useState([]);
  const [showModal,setShowModal] = useState(false);

  const [groupName,setGroupName] = useState("");
  const [description,setDescription] = useState("");
  const [members,setMembers] = useState("");

  useEffect(()=>{
    fetchGroups();
  },[]);

  useEffect(() => {
  fetchGroups();
  fetchUser();
}, []);

const fetchUser = async () => {
  try {
    const res = await API.get("/users/profile");

    setUserName(res.data.payload.fullName); // ✅ correct field

  } catch (err) {
    console.log(err);
  }
  };

  const fetchGroups = async () =>{
    try{
      const res = await API.get("/groups");
      setGroups(res.data.payload);
    }catch(err){
      console.log(err);
    }
  };

  const createGroup = async () =>{

    try{

      const memberList = members.split(",");

      await API.post("/groups/create",{
        name:groupName,
        description:description,
        members:memberList
      });

      setShowModal(false);
      setGroupName("");
      setDescription("");
      setMembers("");

      fetchGroups();

    }catch(err){
      alert("Group creation failed");
    }
  };

  return(
    <>
      <div className="navbar">

        <img src={logo} alt="logo" className="logo-img"/>
        <h2>SharedBalance</h2>

        <div className="menu">
          <span className={location.pathname === "/expenses" ? "active":""}
          onClick={()=>navigate("/expenses")}>Expenses</span>

          <span className={location.pathname === "/history" ? "active":""}
          onClick={()=>navigate("/history")}>History</span>

          <span className={location.pathname === "/profile" ? "active":""}
          onClick={()=>navigate("/profile")}>Account</span>
        </div>

      </div>

      <div className="dashboard">
        <h2 className="welcome-text">Welcome, {userName}!</h2>
        <div className="summary">

          <div className="card">
            <h3>PHP 0.00</h3>
            <p>To Pay</p>
          </div>

          <div className="card">
            <h3>PHP 0.00</h3>
            <p>Received</p>
          </div>

          <div className="card green">
            <h3>PHP 0.00</h3>
            <p>Net Balance</p>
          </div>

        </div>

        <div className="groups">

          <h3>Your Groups</h3>

          {groups.length === 0 ?(

            <div className="empty">
              <p>No groups yet</p>
              <button onClick={()=>setShowModal(true)}>+ Create Group</button>
            </div>

          ):(

            <>
              <button className="create-btn" onClick={()=>setShowModal(true)}>
                + Create Group
              </button>

              {groups.map((g)=>(
                <div key={g.id} className="group-item">

                  <h4>{g.name}</h4>
                  <p>{g.description}</p>

                </div>
              ))}
            </>
          )}

        </div>

      </div>


      {showModal && (

<div className="modal-overlay">

  <div className="modal-card">

    <div className="modal-header">

      <div>
        <h3>Create a group</h3>
        <p>Organize shared expenses with friends</p>
      </div>

      <span className="close-btn" onClick={()=>setShowModal(false)}>✕</span>

    </div>


    <div className="modal-body">

      <div className="input-group">
        <label>Group Name</label>
        <input
        type="text"
        placeholder="Trip to Cebu"
        value={groupName}
        onChange={(e)=>setGroupName(e.target.value)}
        />
      </div>


      <div className="input-group">
        <label>Description</label>
        <input
        type="text"
        placeholder="Weekend vacation expenses"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
        />
      </div>


      <div className="input-group">
        <label>Members</label>
        <input
        type="text"
        placeholder="Anna, John, Mark"
        value={members}
        onChange={(e)=>setMembers(e.target.value)}
        />
      </div>


      <div className="category-section">

        <label>Category</label>

        <div className="categories">

          <button>🏖</button>
          <button>🍽</button>
          <button>🏠</button>
          <button>🎉</button>
          <button>🚗</button>

        </div>

      </div>

    </div>


    <div className="modal-footer">

      <button className="cancel-btn" onClick={()=>setShowModal(false)}>
        Cancel
      </button>

      <button className="create-btn" onClick={createGroup}>
        Create Group
      </button>

    </div>

  </div>

</div>

)}
    </>
  );
}

export default Dashboard;