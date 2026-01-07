// src/pages/FM/FinanceLayout.jsx
import { NavLink, Outlet } from "react-router-dom";

const FinanceLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* TOP FINANCE NAVBAR */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">
            KosquFinance
          </h1>

          {/* ✅ IMPORTANT: RELATIVE PATHS */}
          <nav className="flex gap-6 text-sm font-medium">
            <NavLink
              to="dashboard"
              className="text-slate-600 hover:text-blue-600"
            >
              Dashboard
            </NavLink>

            <NavLink
              to="expenses"
              className="text-slate-600 hover:text-blue-600"
            >
              Expense Management
            </NavLink>

            <NavLink
              to="invoices"
              className="text-slate-600 hover:text-blue-600"
            >
              Invoice Management
            </NavLink>

            <NavLink
              to="payments"
              className="text-slate-600 hover:text-blue-600"
            >
              Payments
            </NavLink>

            <NavLink
              to="budget"
              className="text-slate-600 hover:text-blue-600"
            >
              Budget
            </NavLink>

            <NavLink
              to="reports"
              className="text-slate-600 hover:text-blue-600"
            >
              Reports
            </NavLink>
          </nav>
        </div>
      </div>

      {/* CHILD PAGE */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default FinanceLayout;
