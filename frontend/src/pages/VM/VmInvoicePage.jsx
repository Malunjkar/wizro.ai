import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VmInvoicePage.css";

const VmInvoicePage = () => {
  const [open, setOpen] = useState(false);

  const [vendors, setVendors] = useState([]);
  const [selectedVendorCode, setSelectedVendorCode] = useState("");

  const [form, setForm] = useState({
    billToName: "",
    billToAddress: "",
    contactName: "",
    contactEmail: "",
    contactNo: "",
    quotationDate: "",
    quotationNo: "",
    poNo: "",
    venCode: "",

    items: [{ desc: "", qty: 1, price: 0 }],

    discount: 0,
    sgst: 9,
    cgst: 9,
  });

  /* ================= LOAD VENDORS ================= */
  useEffect(() => {
    axios
      .get("http://localhost:5000/vm/vendors")
      .then((res) => setVendors(res.data))
      .catch(() => {});
  }, []);

  /* ================= CALCULATIONS ================= */
  const subtotal = form.items.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  );

  const subtotalLessDiscount = subtotal - Number(form.discount || 0);
  const sgstAmount = (subtotalLessDiscount * form.sgst) / 100;
  const cgstAmount = (subtotalLessDiscount * form.cgst) / 100;
  const totalTax = sgstAmount + cgstAmount;
  const total = subtotalLessDiscount + totalTax;

  /* ================= HANDLERS ================= */
  const updateItem = (i, key, value) => {
    const items = [...form.items];
    items[i][key] = value;
    setForm({ ...form, items });
  };

  const addRow = () => {
    setForm({
      ...form,
      items: [...form.items, { desc: "", qty: 1, price: 0 }],
    });
  };

  /* ================= VENDOR SELECT ================= */
  const handleVendorSelect = async (code) => {
    setSelectedVendorCode(code);
    if (!code) return;

    const res = await axios.get(
      `http://localhost:5000/vm/vendors/code/${code}`
    );

    const v = res.data;

    setForm((prev) => ({
      ...prev,
      billToName: v.company_name || "",
      billToAddress: v.vendor_address || "",
      venCode: v.vendor_code || "",
    }));
  };

  return (
    <div className="page">
      {!open && (
        <div className="top-right">
          <button className="btn-primary" onClick={() => setOpen(true)}>
            Create Quotation +
          </button>
        </div>
      )}

      {open && (
        <div className="card">
          {/* HEADER */}
          <div className="card-header">
            <h2>Quotation Form</h2>
            <button className="btn-close" onClick={() => setOpen(false)}>
              ✕ Close
            </button>
          </div>

          {/* SELECT VENDOR */}
          <Section title="Select Vendor">
            <select
              className="input"
              value={selectedVendorCode}
              onChange={(e) => handleVendorSelect(e.target.value)}
            >
              <option value="">-- Select Vendor --</option>
              {vendors.map((v) => (
                <option key={v.vendor_id} value={v.vendor_code}>
                  {v.company_name} ({v.vendor_code})
                </option>
              ))}
            </select>
          </Section>

          {/* BILL TO */}
          <Section title="Bill To">
            <input
              className="input"
              value={form.billToName}
              readOnly
            />
            <textarea
              className="textarea"
              value={form.billToAddress}
              readOnly
            />
          </Section>

          {/* CONTACT */}
          <Section title="Contact Person">
            <div className="grid grid-3">
              <input
                className="input"
                placeholder="Name"
                onChange={(e) =>
                  setForm({ ...form, contactName: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="Email"
                onChange={(e) =>
                  setForm({ ...form, contactEmail: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="Contact No"
                onChange={(e) =>
                  setForm({ ...form, contactNo: e.target.value })
                }
              />
            </div>
          </Section>

          {/* QUOTATION DETAILS */}
          <Section title="Quotation Details">
            <div className="grid grid-4">
              <input
                type="date"
                className="input"
                onChange={(e) =>
                  setForm({ ...form, quotationDate: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="Quotation No"
                onChange={(e) =>
                  setForm({ ...form, quotationNo: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="PO No"
                onChange={(e) =>
                  setForm({ ...form, poNo: e.target.value })
                }
              />
              <input
                className="input"
                value={form.venCode}
                readOnly
              />
            </div>
          </Section>

          {/* SERVICES */}
          <Section title="Service Details">
            <table className="table">
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {form.items.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <input
                        className="table-input"
                        onChange={(e) =>
                          updateItem(i, "desc", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="table-input"
                        value={item.qty}
                        onChange={(e) =>
                          updateItem(i, "qty", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="table-input"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(i, "price", e.target.value)
                        }
                      />
                    </td>
                    <td>₹ {item.qty * item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="btn-secondary" onClick={addRow}>
              + Add Row
            </button>
          </Section>

          {/* CALCULATION */}
          <Section title="Calculation">
            <div className="calc-grid">
              <div className="calc-left">
                <p>Subtotal</p>
                <p>Discount</p>
                <p>Subtotal Less Discount</p>
                <p>SGST (%)</p>
                <p>CGST (%)</p>
                <p><b>Total Tax</b></p>
                <p className="total-label">Total</p>
              </div>

              <div className="calc-right">
                <p>₹ {subtotal}</p>

                <input
                  type="number"
                  className="input"
                  value={form.discount}
                  onChange={(e) =>
                    setForm({ ...form, discount: e.target.value })
                  }
                />

                <p>₹ {subtotalLessDiscount}</p>

                <div className="tax-row">
                  <input
                    type="number"
                    className="tax-input"
                    value={form.sgst}
                    onChange={(e) =>
                      setForm({ ...form, sgst: e.target.value })
                    }
                  />
                  <span>% → ₹ {sgstAmount}</span>
                </div>

                <div className="tax-row">
                  <input
                    type="number"
                    className="tax-input"
                    value={form.cgst}
                    onChange={(e) =>
                      setForm({ ...form, cgst: e.target.value })
                    }
                  />
                  <span>% → ₹ {cgstAmount}</span>
                </div>

                <p><b>₹ {totalTax}</b></p>
                <p className="total-value">₹ {total}</p>
              </div>
            </div>
          </Section>

          {/* ACTIONS */}
          <div className="actions">
            <button className="btn-secondary">Download PDF</button>
            <button className="btn-primary">Download Excel</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* SMALL COMPONENT */
const Section = ({ title, children }) => (
  <div className="section">
    <h4>{title}</h4>
    {children}
  </div>
);

export default VmInvoicePage;
