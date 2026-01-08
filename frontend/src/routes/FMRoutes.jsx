import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/context/ProtectedRoute";

import FinanceLayout from "@/pages/FM/FinanceLayout";
import FinanceDashboard from "@/pages/FM/FinanceDashboard";
import ExpenseManagement from "@/pages/FM/ExpenseManagement";
import AddExpense from "@/pages/FM/AddExpense";
import ExpenseApproval from "@/pages/FM/ExpenseApproval";

// ✅ Invoice Management pages
import InvoiceList from "@/pages/FM/InvoiceList";
import InvoiceCreate from "@/pages/FM/InvoiceCreate";
import InvoiceView from "@/pages/FM/InvoiceView";
import InvoiceWorkflowConfig from "@/pages/FM/InvoiceWorkflowConfig";

const fmChildren = [
  // Default redirect: /fm → /fm/dashboard
  { index: true, element: <Navigate to="dashboard" replace /> },

  // Dashboard
  { path: "dashboard", element: <FinanceDashboard /> },

  // Expense Management
  { path: "expenses", element: <ExpenseManagement /> },
  { path: "expenses/add", element: <AddExpense /> },
  { path: "expenses/approvals", element: <ExpenseApproval /> },

  // ✅ Invoice Management
  { path: "invoices", element: <InvoiceList /> },
  { path: "invoices/create", element: <InvoiceCreate /> },
  { path: "invoices/:id", element: <InvoiceView /> },

  // ✅ Invoice Approval Workflow Config
  { path: "invoice-workflow", element: <InvoiceWorkflowConfig /> },
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
