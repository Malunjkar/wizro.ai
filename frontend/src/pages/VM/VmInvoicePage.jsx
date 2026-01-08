import React, { useState } from 'react';

const VmInvoicePage = () => {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    billToName: '',
    billToAddress: '',
    contactName: '',
    contactEmail: '',
    contactNo: '',
    quotationDate: '',
    quotationNo: '',
    poNo: '',
    venCode: '',

    items: [{ desc: '', qty: 1, price: 0 }],

    pan: '',
    gstNo: '',
    bankName: '',
    accountNo: '',
    ifsc: '',

    discount: 0,
    sgst: 9,
    cgst: 9,
  });

  /* ================= CALCULATIONS ================= */
  const subtotal = form.items.reduce((sum, i) => sum + i.qty * i.price, 0);
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
      items: [...form.items, { desc: '', qty: 1, price: 0 }],
    });
  };

  return (
    <div style={{ padding: 24, background: '#f4f6f8', minHeight: '100vh' }}>
      {!open && (
        <div style={{ textAlign: 'right' }}>
          <button onClick={() => setOpen(true)} style={styles.primaryBtn}>
            Create Quotation +
          </button>
        </div>
      )}

      {open && (
        <div style={styles.card}>
          <h2 style={{ marginBottom: 20 }}>Quotation Form</h2>

          {/* BILL TO */}
          <Section title="Bill To">
            <input
              style={styles.input}
              placeholder="Company Name"
              onChange={(e) => setForm({ ...form, billToName: e.target.value })}
            />
            <textarea
              style={styles.textarea}
              placeholder="Company Address"
              onChange={(e) => setForm({ ...form, billToAddress: e.target.value })}
            />
          </Section>

          {/* CONTACT */}
          <Section title="Contact Person">
            <div style={styles.grid3}>
              <input
                style={styles.input}
                placeholder="Name"
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Email"
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Contact No"
                onChange={(e) => setForm({ ...form, contactNo: e.target.value })}
              />
            </div>
          </Section>

          {/* META */}
          <Section title="Quotation Details">
            <div style={styles.grid4}>
              <input
                type="date"
                style={styles.input}
                onChange={(e) => setForm({ ...form, quotationDate: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Quotation No"
                onChange={(e) => setForm({ ...form, quotationNo: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="PO No"
                onChange={(e) => setForm({ ...form, poNo: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Ven Code"
                onChange={(e) => setForm({ ...form, venCode: e.target.value })}
              />
            </div>
          </Section>

          {/* SERVICES */}
          <Section title="Service Details">
            <table style={styles.table}>
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
                      <input style={styles.tableInput} onChange={(e) => updateItem(i, 'desc', e.target.value)} />
                    </td>
                    <td>
                      <input
                        type="number"
                        style={styles.tableInput}
                        value={item.qty}
                        onChange={(e) => updateItem(i, 'qty', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        style={styles.tableInput}
                        value={item.price}
                        onChange={(e) => updateItem(i, 'price', e.target.value)}
                      />
                    </td>
                    <td>₹ {item.qty * item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={addRow} style={styles.secondaryBtn}>
              + Add Row
            </button>
          </Section>

          {/* COMPANY DETAILS */}
          <Section title="Company Details">
            <div style={styles.grid3}>
              <input style={styles.input} placeholder="PAN" />
              <input style={styles.input} placeholder="GST No" />
              <input style={styles.input} placeholder="Bank Name" />
              <input style={styles.input} placeholder="A/c No" />
              <input style={styles.input} placeholder="Branch & IFSC Code" />
            </div>
          </Section>

          {/* TOTALS */}
          {/* TOTALS */}
          <Section title="Calculation">
            <div style={styles.calcGrid}>
              {/* LEFT LABELS */}
              <div style={styles.calcLeft}>
                <p>Subtotal</p>
                <p>Discount</p>
                <p>Subtotal Less Discount</p>

                <p>SGST (%)</p>
                <p>CGST (%)</p>

                <p>
                  <b>Total Tax</b>
                </p>
                <p style={{ fontWeight: 'bold', fontSize: 16 }}>Total</p>
              </div>

              {/* RIGHT VALUES */}
              <div style={styles.calcRight}>
                <p>₹ {subtotal}</p>

                <input
                  type="number"
                  style={styles.input}
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                />

                <p>₹ {subtotalLessDiscount}</p>

                {/* SGST */}
                <div style={styles.taxRow}>
                  <input
                    type="number"
                    style={styles.taxInput}
                    value={form.sgst}
                    onChange={(e) => setForm({ ...form, sgst: e.target.value })}
                  />
                  <span>% → ₹ {sgstAmount}</span>
                </div>

                {/* CGST */}
                <div style={styles.taxRow}>
                  <input
                    type="number"
                    style={styles.taxInput}
                    value={form.cgst}
                    onChange={(e) => setForm({ ...form, cgst: e.target.value })}
                  />
                  <span>% → ₹ {cgstAmount}</span>
                </div>

                <p>
                  <b>₹ {totalTax}</b>
                </p>
                <p style={{ fontWeight: 'bold', fontSize: 16 }}>₹ {total}</p>
              </div>
            </div>
          </Section>

          {/* ACTIONS */}
          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <button style={styles.secondaryBtn}>Download PDF</button>
            <button style={{ ...styles.primaryBtn, marginLeft: 10 }}>Download Excel</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= SMALL COMPONENT ================= */
const Section = ({ title, children }) => (
  <div style={{ marginBottom: 24 }}>
    <h4 style={{ marginBottom: 10 }}>{title}</h4>
    {children}
  </div>
);

/* ================= STYLES ================= */
const styles = {
  card: {
    background: '#fff',
    padding: 24,
    maxWidth: 1000,
    margin: 'auto',
    borderRadius: 8,
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  },
  input: {
    padding: 8,
    width: '100%',
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  textarea: {
    padding: 8,
    width: '100%',
    borderRadius: 4,
    border: '1px solid #ccc',
    minHeight: 80,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableInput: {
    width: '100%',
    padding: 6,
    border: '1px solid #ccc',
    borderRadius: 4,
  },
  primaryBtn: {
    padding: '10px 18px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '8px 14px',
    background: '#e5e7eb',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    marginTop: 10,
  },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 },
  grid4: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 },
  calcBox: {
    background: '#f9fafb',
    padding: 16,
    borderRadius: 6,
  },
  calcGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    background: '#f9fafb',
    padding: 16,
    borderRadius: 6,
  },

  calcLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    fontWeight: 500,
  },

  calcRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    textAlign: 'right',
  },

  taxRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },

  taxInput: {
    width: 60,
    padding: 6,
    borderRadius: 4,
    border: '1px solid #ccc',
    textAlign: 'right',
  },
};

export default VmInvoicePage;
