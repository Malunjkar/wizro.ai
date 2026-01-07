import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/context/ProtectedRoute";

import FinanceLayout from "@/pages/FM/FinanceLayout";
import FinanceDashboard from "@/pages/FM/FinanceDashboard";
import ExpenseManagement from "@/pages/FM/ExpenseManagement";
import AddExpense from "@/pages/FM/AddExpense";
import ExpenseApproval from "@/pages/FM/ExpenseApproval";

const fmChildren = [
  {
    index: true,
    element: <Navigate to="dashboard" replace />,
  },
  {
    path: "dashboard",
    element: <FinanceDashboard />,
  },
  {
    path: "expenses",
    element: <ExpenseManagement />,
  },
  {
    path: "expenses/add",
    element: <AddExpense />,
  },
  {
    path: "expenses/approvals",
    element: <ExpenseApproval />,
  },
];

export default [
  {
    path: "/fm",
    element: (
      <ProtectedRoute>
        <FinanceLayout />
      </ProtectedRoute>
    ),
    children: fmChildren,
  },
  {
    path: "/hr/fm",
    element: (
      <ProtectedRoute>
        <FinanceLayout />
      </ProtectedRoute>
    ),
    children: fmChildren,
  },
  {
    path: "/pm/fm",
    element: (
      <ProtectedRoute>
        <FinanceLayout />
      </ProtectedRoute>
    ),
    children: fmChildren,
  },
  {
    path: "/employee/fm",
    element: (
      <ProtectedRoute>
        <FinanceLayout />
      </ProtectedRoute>
    ),
    children: fmChildren,
  },
];
