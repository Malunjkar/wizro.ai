import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/context/ProtectedRoute";

import FinanceLayout from "@/pages/FM/FinanceLayout";
import FinanceDashboard from "@/pages/FM/FinanceDashboard";
import ExpenseManagement from "@/pages/FM/ExpenseManagement";
import AddExpense from "@/pages/FM/AddExpense";
import ExpenseApproval from "@/pages/FM/ExpenseApproval";

export default {
  path: "/fm",
  element: <FinanceLayout />,

  children: [
    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },

    {
      path: "dashboard",
      element: (
        <ProtectedRoute>
          <FinanceDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "expenses",
      element: (
        <ProtectedRoute>
          <ExpenseManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "expenses/add",
      element: (
        <ProtectedRoute>
          <AddExpense />
        </ProtectedRoute>
      ),
    },
    {
      path: "expenses/approvals",
      element: (
        <ProtectedRoute>
          <ExpenseApproval />
        </ProtectedRoute>
      ),
    },
  ],
};
