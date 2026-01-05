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

const router = express.Router();

/* ================= EXPENSE ROUTES ================= */

// 🔐 GET ALL EXPENSES (ROLE-AWARE)
router.get('/expenses', authMiddleware, getAllExpenses);

// 🔐 CREATE EXPENSE (ANY LOGGED-IN USER)
router.post('/expenses', authMiddleware, createExpense);

// 🔐 PENDING EXPENSES (ADMIN / HR / PM)
router.get('/expenses/pending', authMiddleware, getPendingExpenses);

// 🔐 APPROVE EXPENSE
router.post('/expenses/:id/approve', authMiddleware, approveExpense);

// 🔐 REJECT EXPENSE
router.post('/expenses/:id/reject', authMiddleware, rejectExpense);

// 🔐 DELETE EXPENSE
router.delete('/expenses/:id', authMiddleware, deleteExpense);

/* ================= EMPLOYEES ================= */

// 🔐 FETCH EMPLOYEES (FOR DROPDOWN ETC.)
router.get('/employees', authMiddleware, getAllEmployees);

export default router;
