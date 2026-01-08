import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosConfig";
import { Link } from "react-router-dom";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axiosInstance.get("/fm/invoices").then(res => setInvoices(res.data));
  }, []);

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Invoice Management
        </h1>

        <Link
          to="/fm/invoices/create"
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
        >
          + Create Invoice
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-200 text-slate-700 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Invoice No</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-slate-500"
                >
                  No invoices found
                </td>
              </tr>
            )}

            {invoices.map(inv => (
              <tr key={inv.invoice_id} className="border-b text-sm">
                <td className="px-4 py-3 font-medium">
                  {inv.invoice_number}
                </td>
                <td className="px-4 py-3">
                  ₹{inv.total_amount}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/fm/invoices/${inv.invoice_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
