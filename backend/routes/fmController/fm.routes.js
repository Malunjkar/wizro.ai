import express from 'express';
import authMiddleware from '../../middleware/auth.middleware.js'; // ✅ AUTH MIDDLEWARE

import {
  getAllEmployees,
  getAllExpenses,
  createExpense,
  getPendingExpenses,
  approveExpense,
  rejectExpense,
  deleteExpense,
} from '../../controllers/fm.expense.controller.js';

// ✅ IMPORT INVOICE ROUTES
import invoiceRoutes from './invoice.routes.js';

const fmrouter = express.Router();

/* ================= EXPENSE ROUTES ================= */

// 🔐 GET ALL EXPENSES (ROLE-AWARE)
fmrouter.get('/expenses', authMiddleware, getAllExpenses);

// 🔐 CREATE EXPENSE (ANY LOGGED-IN USER)
fmrouter.post('/expenses', authMiddleware, createExpense);

// 🔐 PENDING EXPENSES (ADMIN / HR / PM)
fmrouter.get('/expenses/pending', authMiddleware, getPendingExpenses);

// 🔐 APPROVE EXPENSE
fmrouter.post('/expenses/:id/approve', authMiddleware, approveExpense);

// 🔐 REJECT EXPENSE
fmrouter.post('/expenses/:id/reject', authMiddleware, rejectExpense);

// 🔐 DELETE EXPENSE
fmrouter.delete('/expenses/:id', authMiddleware, deleteExpense);

/* ================= EMPLOYEES ================= */

// 🔐 FETCH EMPLOYEES (FOR DROPDOWN ETC.)
fmrouter.get('/employees', authMiddleware, getAllEmployees);

/* ================= INVOICE ROUTES ================= */

// 🔐 INVOICE MANAGEMENT (CREATE / LIST / VIEW / APPROVE / PDF)
fmrouter.use('/invoices', authMiddleware, invoiceRoutes);

export default fmrouter;
