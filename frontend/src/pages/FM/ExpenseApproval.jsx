import React, { useEffect, useState } from "react";
import axios from "axios";
 
const ExpenseApproval = () => {
    const [pending, setPending] = useState([]);
 
    useEffect(() => {
        fetchPending();
    }, []);
 
    const fetchPending = async () => {
        const res = await axios.get("/api/fm/expenses/pending");
        setPending(res.data);
    };
 
    const approveExpense = async (id) => {
        await axios.post(`/api/fm/expenses/${id}/approve`);
        fetchPending();
    };
 
    return (
        <div className="page-card">
            <h2>Pending Expense Approvals</h2>
 
            {pending.map((e) => (
                <div key={e.expense_id} style={{ marginBottom: "10px" }}>
                    {e.expense_title} – ₹{e.amount}
                    <button onClick={() => approveExpense(e.expense_id)}>
                        Approve
                    </button>
                </div>
            ))}
        </div>
    );
};
 
export default ExpenseApproval;
 
 