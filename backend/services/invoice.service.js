import { v4 as uuid } from "uuid";
import pool from "../config/config.js";

export const createInvoice = async (data, user) => {
    if (!user) throw new Error("User not authenticated");

    const invoiceId = uuid();
    const invoiceNumber = "INV-" + Date.now();

    const subtotal = Number(data.subtotal);
    const tax = Number(data.tax_amount || 0);
    const total = subtotal + tax;

    await pool.query(
        `INSERT INTO tbl_invoices
     (invoice_id, invoice_number, subtotal, tax_amount, total_amount, status, created_by)
     VALUES ($1,$2,$3,$4,$5,'PENDING',$6)`,
        [
            invoiceId,
            invoiceNumber,
            subtotal,
            tax,
            total,
            user.empID, // ✅ UUID expected here
        ]
    );

    return invoiceId;
};



export const getInvoices = async () => {
    const result = await pool.query(`
    SELECT
      invoice_id,
      invoice_number,
      total_amount,
      status
    FROM tbl_invoices
    ORDER BY created_at DESC
  `);

    return result.rows;
};



export const getInvoiceById = async (invoiceId) => {
    const invoiceRes = await pool.query(
        `SELECT * FROM tbl_invoices WHERE invoice_id=$1`,
        [invoiceId]
    );

    const approvalRes = await pool.query(
        `SELECT * FROM tbl_invoice_approvals
     WHERE invoice_id=$1
     ORDER BY level_no`,
        [invoiceId]
    );

    return {
        invoice: invoiceRes.rows[0],
        approvals: approvalRes.rows
    };
};
