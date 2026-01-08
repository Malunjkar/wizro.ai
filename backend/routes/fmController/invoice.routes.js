import express from "express";
import multer from "multer";
import path from "path";

import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  approveInvoice,
  generateInvoicePdf,
} from "../../controllers/invoice.controller.js";

const router = express.Router();

/* ---------- MULTER ---------- */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ---------- ROUTES ---------- */

// ❌ authMiddleware yahan mat lagao (already fmrouter me laga hua hai)
router.post("/", upload.single("invoicePdf"), createInvoice);

router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.post("/:id/approve", approveInvoice);
router.post("/:id/generate-pdf", generateInvoicePdf);

export default router;
