import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/groupDetails.css";

function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  const [group, setGroup] = useState(null);
  const [view, setView] = useState("menu");

  const [participants, setParticipants] = useState([]);
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
  const init = async () => {
    const res = await API.get("/users/profile");
    const email = res.data.payload.email;

    setUserEmail(email);

    const groupRes = await fetchGroup();
    await fetchPayments(); // ONLY after group exists

    const exp = await fetchExpenses(email);

    if (exp.length > 0) setView("summary");
  };

  init();
  }, []);

  const fetchPayments = async () => {
  try {
    const res = await API.get(`/payments/group/${groupId}`);
    setPayments(res.data);
  } catch (err) {
    console.error(err);
  }
  };

  const markPaid = async (paymentId) => {
  try {
    await API.put(`/payments/${paymentId}/mark-paid`, null, {
      params: { userEmail }
    });

    await fetchPayments();
    await fetchExpenses(userEmail);
    await API.get(`/payments/balance?email=${userEmail}`);
  } catch (err) {
    console.error(err);
    alert("Failed to mark as paid");
  }
};

  const fetchGroup = async () => {
    try {
      const res = await API.get(`/groups/${groupId}`);
      const groupData = res.data.payload;
      
      setGroup(groupData);

      // ✅ Use emails consistently (NOT names)
      const allParticipants = [
        groupData.creatorEmail,
        ...(groupData.members || [])
      ];

      // ✅ remove duplicates just in case
      const uniqueParticipants = [...new Set(allParticipants)];

      setParticipants(uniqueParticipants);

    } catch (err) {
      console.log(err);
    }
  };

  const fetchExpenses = async (email) => {
  try {
    const res = await API.get(`/expenses/group/${groupId}?email=${email}`);
    setExpenses(res.data);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
  };

  const calculateSplit = async () => {
  if (!payer) {
    alert("Please select a payer");
    return;
  }

  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  try {
    const res = await API.post("/expenses/calculate", {
      participants,
      payer,
      amount,
      groupId: group.id,
      groupName: group.name
    });

    // ✅ refresh expenses list
    await fetchExpenses(userEmail);
    await API.get(`/payments/balance?email=${userEmail}`);
    setView("summary");

  } catch (err) {
    console.error(err);
    alert("Calculation failed");
  }
  };

  if (!group) return <p>Loading...</p>;

  return (
    <div className="group-details">

      {/* BACK */}
      <button onClick={() => navigate("/expenses", { state: { refresh: true } })}>← Back</button>

      {/* GROUP INFO */}
      <h2>{group.name}</h2>
      <p>{group.description}</p>

      {/* MENU */}
      {view === "menu" && (
        <div className="actions">
          <button onClick={() => setView("calculate")}>
            Calculate Share
          </button>

          <button onClick={() => setView("summary")}>
            View Share
          </button>
        </div>
      )}

      {/* CALCULATE */}
      {view === "calculate" && (
        <div className="calculator">

          {/* PARTICIPANTS */}
          <label>Participants</label>
          <div className="participants-list">
            {participants.map((p, i) => (
              <div key={i} className="participant-chip">
                {p === group.creatorEmail ? `${p} (Creator)` : p}
              </div>
            ))}
          </div>

          {/* PAYER */}
          <label>Paid by</label>
          <select value={payer} onChange={(e) => setPayer(e.target.value)}>
            <option value="">Select payer</option>
            {participants.map((p, i) => (
              <option key={i} value={p}>
                {p === group.creatorEmail ? `${p} (Creator)` : p}
              </option>
            ))}
          </select>

          {/* AMOUNT */}
          <label>Total Amount</label>
          <input
            type="number"
            placeholder="Enter total amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {expenses.length > 0 && (
            <p className="warning-text">Expenses already calculated for this group</p>
          )}

          <button 
            className="calculate-btn" 
            onClick={calculateSplit}
            disabled={expenses.length > 0}
          >
            Calculate
          </button>

        </div>
      )}

      {/* SUMMARY */}
      {view === "summary" && (
  <div className="summary">

    {expenses.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Payer</th>
            <th>Amount</th>
            <th>Breakdown</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => {
            const breakdown = JSON.parse(exp.breakdown);

            return (
              <tr key={exp.id}>
                <td>{exp.payer}</td>
                <td>₱{exp.totalAmount}</td>
                <td>
                <div className="breakdown-box">
                  {Object.entries(breakdown).map(([p, val]) => {
                  const payment = payments?.find(
                    pay => pay.payer === p && pay.receiver === exp.payer
                  );
                  console.log("payments:", payments);
                  console.log("participant:", p, "payer:", exp.payer);
                  console.log("matched payment:", payment);
                  return (
                    <div key={p} className="breakdown-item">
                      <span>{p}</span>
                      <span>₱{val}</span>

                      {p !== exp.payer && (
                        <>
                          {payment ? (
                            payment.paid ? <span>✅ Paid</span> :
                            userEmail === group.creatorEmail && (
                              <button onClick={() => markPaid(payment.id)}>
                                Mark as Paid
                              </button>
                            )
                          ) : (
                            <span style={{ color: "gray" }}>No record</span>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
                </div>
              </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    ) : (
      <p>No expenses yet</p>
    )}

  </div>
  )}

    </div>
  );
}

export default GroupDetails;