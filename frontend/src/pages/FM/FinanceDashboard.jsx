// src/pages/FM/FinanceDashboard.jsx
const FinanceDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Finance Dashboard
      </h2>
      <p className="text-slate-600 mb-6">
        Overview of expenses, payments, budgets, and reports
      </p>
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-sm text-slate-500">Total Expenses</p>
          <p className="text-2xl font-bold">₹0</p>
        </div>
 
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-sm text-slate-500">Pending Approvals</p>
          <p className="text-2xl font-bold">0</p>
        </div>
 
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-sm text-slate-500">Monthly Budget</p>
          <p className="text-2xl font-bold">₹0</p>
        </div>
      </div>
    </div>
  );
};
 
export default FinanceDashboard;
 
 