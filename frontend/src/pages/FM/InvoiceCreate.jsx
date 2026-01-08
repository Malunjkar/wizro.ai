import { useState } from "react";
import axiosInstance from "@/lib/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function InvoiceCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subtotal: "",
    tax: "",
    file: null,
  });

  const submit = async () => {
    if (!form.subtotal) {
      alert("Subtotal is required");
      return;
    }

    const data = new FormData();
    data.append("subtotal", form.subtotal);
    data.append("tax_amount", form.tax || 0);
    if (form.file) data.append("invoicePdf", form.file);

    await axiosInstance.post("/fm/invoices", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/fm/invoices");
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">
          Create Invoice
        </h2>

        <div className="space-y-4">
          <input
            type="number"
            placeholder="Subtotal"
            className="w-full border rounded-md p-2"
            onChange={e =>
              setForm({ ...form, subtotal: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Tax"
            className="w-full border rounded-md p-2"
            onChange={e =>
              setForm({ ...form, tax: e.target.value })
            }
          />

          <input
            type="file"
            className="w-full border rounded-md p-2"
            onChange={e =>
              setForm({ ...form, file: e.target.files[0] })
            }
          />

          <button
            onClick={submit}
            className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition"
          >
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
