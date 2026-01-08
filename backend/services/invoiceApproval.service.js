import { v4 as uuid } from "uuid";
import pool from "../config/config.js";

export const approveInvoice = async (invoiceId, user) => {

  // 1️⃣ Invoice fetch
  const invRes = await pool.query(
    `SELECT * FROM tbl_invoices WHERE invoice_id=$1`,
    [invoiceId]
  );
  const invoice = invRes.rows[0];
  if (!invoice) throw new Error("Invoice not found");

  // 2️⃣ Workflow select (amount based)
  const wfRes = await pool.query(
    `SELECT * FROM tbl_workflows
     WHERE module_name='INVOICE'
     AND $1 BETWEEN min_amount AND max_amount`,
    [invoice.total_amount]
  );
  const workflow = wfRes.rows[0];
  if (!workflow) throw new Error("Workflow not configured");

  // 3️⃣ Next pending approval level
  const lvlRes = await pool.query(
    `SELECT level_no, role_id
     FROM tbl_workflow_levels
     WHERE workflow_id=$1
     AND level_no NOT IN (
       SELECT level_no FROM tbl_invoice_approvals
       WHERE invoice_id=$2 AND status='APPROVED'
     )
     ORDER BY level_no
     LIMIT 1`,
    [workflow.workflow_id, invoiceId]
  );

  const level = lvlRes.rows[0];

  // 4️⃣ If all levels approved
  if (!level) {
    await pool.query(
      `UPDATE tbl_invoices SET status='APPROVED'
       WHERE invoice_id=$1`,
      [invoiceId]
    );
    return { message: "Invoice fully approved" };
  }

  // 5️⃣ Role check
  if (user.role_id !== level.role_id) {
    throw new Error("You are not authorized to approve this invoice");
  }

  // 6️⃣ Save approval
  await pool.query(
    `INSERT INTO tbl_invoice_approvals
     (approval_id, invoice_id, level_no,
      approved_by, status, approved_at)
     VALUES ($1,$2,$3,$4,'APPROVED',NOW())`,
    [uuid(), invoiceId, level.level_no, user.user_id]
  );

  return {
    message: `Invoice approved at level ${level.level_no}`
  };
};
