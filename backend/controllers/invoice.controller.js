import * as invoiceService from "../services/invoice.service.js";
import * as approvalService from "../services/invoiceApproval.service.js";
import * as pdfService from "../services/invoicePdf.service.js";

export const createInvoice = async (req, res) => {
  try {
    console.log("========== CREATE INVOICE ==========");
    console.log("req.user =", req.user);
    console.log("req.body =", req.body);
    console.log("req.file =", req.file);

    const invoiceId = await invoiceService.createInvoice(
      {
        ...req.body,
        pdf_file: req.file ? req.file.filename : null,
      },
      req.user
    );

    console.log("Invoice created with ID:", invoiceId);

    res.status(201).json({
      message: "Invoice created",
      invoiceId,
    });
  } catch (err) {
    console.error("🔥 CREATE INVOICE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};




export const getInvoices = async (req, res) => {
  try {
    console.log("===== GET INVOICES API HIT =====");
    const invoices = await invoiceService.getInvoices();
    console.log("Invoices:", invoices);
    res.status(200).json(invoices);
  } catch (err) {
    console.error("🔥 GET INVOICES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



export const getInvoiceById = async (req, res) => {
    try {
        const data = await invoiceService.getInvoiceById(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const approveInvoice = async (req, res) => {
    try {
        const result = await approvalService.approveInvoice(
            req.params.id,
            req.user
        );
        res.json(result);
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
};

export const generateInvoicePdf = async (req, res) => {
    try {
        const filePath = await pdfService.generateInvoicePdf(req.params.id);
        res.json({ message: "PDF generated", filePath });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
