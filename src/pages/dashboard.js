import React, { useState } from "react";
import "../styles/dashboard.css";

function Dashboard(){

  const [groups,setGroups] = useState([]);

  const createGroup = () =>{
    const name = prompt("Enter group name");

    if(name){
      setGroups([...groups,name]);
    }
  };

  return(

    <div className="dashboard">

      <div className="navbar">
        <h2>SharedBalance</h2>

        <div className="menu">
          <span>Expenses</span>
          <span>History</span>
          <span>Account</span>
        </div>
      </div>

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

        {groups.length === 0 ? (

          <div className="empty">
            <p>No groups yet</p>
            <button onClick={createGroup}>+ Create Group</button>
          </div>

        ):(

          groups.map((g,index)=>(
            <div key={index} className="group-item">{g}</div>
          ))

        )}

      </div>

    </div>

  );
}

export default Dashboard;