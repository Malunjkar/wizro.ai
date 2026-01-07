import { useAuth } from "@/context/AuthContext";

const FinanceDashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role; // 1=Admin, 2=PM, 3=Employee, 4=HR

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Finance Dashboard
      </h2>
      <p className="text-slate-600 mb-6">
        Overview of expenses, payments, budgets, and reports
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ✅ Visible to ALL roles */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-sm text-slate-500">Total Expenses</p>
          <p className="text-2xl font-bold">₹0</p>
        </div>

        {/* ❌ Employee should NOT see approvals */}
        {role !== 3 && (
          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-sm text-slate-500">Pending Approvals</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        )}

        {/* ✅ Visible to Admin / HR / PM */}
        {role !== 3 && (
          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-sm text-slate-500">Monthly Budget</p>
            <p className="text-2xl font-bold">₹0</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceDashboard;
