import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axiosConfig";
import { toast } from "sonner";

const AddExpense = () => {
  const navigate = useNavigate();
 
  const [employees, setEmployees] = useState([]);
 
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get("/fm/employees");
        setEmployees(res.data || []);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    };
 
    fetchEmployees();
  }, []);
 
  const [form, setForm] = useState({
    expense_type: "Employee",
    expense_title: "",
    expense_category_id: null,
    amount: "",
    expense_date: "",
    payment_mode: "",
    employee_id: "",
    remarks: "",
  });
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
 
  const submitExpense = async (e) => {
    e.preventDefault();
 
    try {
      const payload = {
        ...form,
        employee_id: null,
        amount: parseFloat(form.amount),
      };
 
      await axiosInstance.post("/fm/expenses", payload);
 
      toast.success("Expense added successfully");
 
      setForm({
        expense_type: "Employee",
        expense_title: "",
        expense_category_id: null,
        amount: "",
        expense_date: "",
        payment_mode: "",
        employee_id: "",
        remarks: "",
      });
 
      navigate("/fm/expenses");
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to save expense");
    }
  };
 
  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>Add Expense</h2>
 
        <form onSubmit={submitExpense} style={grid}>
          <select
            name="expense_type"
            value={form.expense_type}
            onChange={handleChange}
            style={input}
          >
            <option value="Employee">Employee</option>
            <option value="Project">Project</option>
            <option value="Vendor">Vendor</option>
          </select>
 
          <input
            name="expense_title"
            placeholder="Expense Title"
            value={form.expense_title}
            onChange={handleChange}
            style={input}
            required
          />
 
          <input
            type="number"
            name="amount"
            step="0.01"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            style={input}
            required
          />
 
          <input
            type="date"
            name="expense_date"
            value={form.expense_date}
            onChange={handleChange}
            style={input}
            required
          />
 
          <input
            name="payment_mode"
            placeholder="Payment Mode"
            value={form.payment_mode}
            onChange={handleChange}
            style={input}
          />
 
          {form.expense_type === "Employee" && (
            <textarea
              name="remarks"
              placeholder="Expense Reason (Employee related)"
              value={form.remarks}
              onChange={handleChange}
              style={{ ...input, gridColumn: "1 / -1" }}
              required
            />
          )}
 
 
          {form.expense_type !== "Employee" && (
            <textarea
              name="remarks"
              placeholder="Remarks"
              value={form.remarks}
              onChange={handleChange}
              style={{ ...input, gridColumn: "1 / -1" }}
            />
          )}
 
          <div style={actions}>
            <button type="submit" style={saveBtn}>
              Save Expense
            </button>
 
            <button
              type="button"
              onClick={() => navigate("/fm")}
              style={cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
 
/* ================= STYLES ================= */
 
const page = {
  background: "#f3f4f6",
  minHeight: "100vh",
  padding: "40px",
};
 
const card = {
  background: "#ffffff",
  maxWidth: "900px",
  margin: "auto",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};
 
const title = {
  marginBottom: "20px",
};
 
const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px",
};
 
const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
};
 
const actions = {
  gridColumn: "1 / -1",
  display: "flex",
  gap: "10px",
};
 
const saveBtn = {
  background: "#2563eb",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};
 
const cancelBtn = {
  background: "#e5e7eb",
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};
 
export default AddExpense;
 
 