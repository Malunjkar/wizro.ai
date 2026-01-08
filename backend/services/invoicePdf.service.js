import PDFDocument from "pdfkit";
import fs from "fs";
import { v4 as uuid } from "uuid";
import pool from "../config/config.js";

export const generateInvoicePdf = async (invoiceId) => {

    const res = await pool.query(
        `SELECT * FROM tbl_invoices WHERE invoice_id=$1`,
        [invoiceId]
    );
    const invoice = res.rows[0];
    if (!invoice) throw new Error("Invoice not found");

    const dir = "uploads/invoices";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = `${dir}/${invoiceId}.pdf`;

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text("Company Name");
    doc.moveDown();
    doc.fontSize(12).text(`Invoice No: ${invoice.invoice_number || invoiceId}`);
    doc.text(`Total Amount: ₹${invoice.total_amount}`);
    doc.text(`Status: ${invoice.status}`);

    doc.end();

    await pool.query(
        `INSERT INTO tbl_invoice_documents
     (document_id, invoice_id, document_type, file_path)
     VALUES ($1,$2,'GENERATED',$3)`,
        [uuid(), invoiceId, filePath]
    );

    return filePath;
};
