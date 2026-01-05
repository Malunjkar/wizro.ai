import React from "react";
import { useNavigate } from "react-router-dom";
import ExpenseList from "./ExpenseList";
 
const ExpenseManagement = () => {
  const navigate = useNavigate();
 
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Expense Management</h1>
 
        <button
          onClick={() => navigate("/fm/expenses/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Expense
        </button>
      </div>
 
      {/* 🔥 YAHAN ACTUAL LOGIC WALA TABLE */}
      <ExpenseList />
    </div>
  );
};
 
export default ExpenseManagement;
 
 