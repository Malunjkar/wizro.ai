import pool from "../../config/config.js";
import vmSqlc from "./vmSqlc.js";

/* ===========================
   EXISTING FUNCTIONS (UNCHANGED)
=========================== */

const getDashboardStats = async (req, res) => {
  try {
    res.json([
      {
        total_vms: 12,
        running_vms: 8,
        stopped_vms: 3,
        pending_vms: 1,
        avg_cpu: 64,
        total_storage: 520,
      },
    ]);
  } catch {
    res.status(500).json({ message: "VM dashboard stats error" });
  }
};

const getVmUsageStats = async (req, res) => {
  try {
    res.json([
      { id: 1, vm_name: "VM-Production", cpu: 70, ram: 16, status: "Running" },
      { id: 2, vm_name: "VM-Staging", cpu: 35, ram: 8, status: "Stopped" },
    ]);
  } catch {
    res.status(500).json({ message: "VM usage stats error" });
  }
};

/* ===========================
   NEW VENDOR FUNCTIONS
=========================== */

const addVendor = async (req, res) => {
  try {
    const {
      vendorCode,
      companyName,
      businessType,
      industry,
      registrationNumber,
      gstNumber,
      panNumber,
      website,
    } = req.body;

    const result = await pool.query(vmSqlc.insertVendorQuery, [
      vendorCode,
      companyName,
      businessType,
      industry,
      registrationNumber,
      gstNumber,
      panNumber,
      website,
    ]);

    res.status(201).json({
      message: "Vendor added successfully",
      vendor: result.rows[0],
    });
  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(400).json({ message: "Vendor code already exists" });
    }

    res.status(500).json({ message: "Error adding vendor" });
  }
};

const getAllVendors = async (_req, res) => {
  try {
    const result = await pool.query(vmSqlc.getAllVendorsQuery);
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Error fetching vendors" });
  }
};
const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      companyName,
      businessType,
      industry,
      registrationNumber,
      gstNumber,
      panNumber,
      website,
    } = req.body;

    const result = await pool.query(vmSqlc.updateVendorQuery, [
      companyName,
      businessType,
      industry,
      registrationNumber,
      gstNumber,
      panNumber,
      website,
      id, // 👈 MUST be last (matches $8)
    ]);

    res.json({
      message: "Vendor updated successfully",
      vendor: result.rows[0],
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Error updating vendor" });
  }
};

const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(vmSqlc.deleteVendorQuery, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({
      message: "Vendor deleted permanently",
      vendor: result.rows[0],
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Error deleting vendor" });
  }
};



export default {
  getDashboardStats,
  getVmUsageStats,
  addVendor,
  getAllVendors,
  updateVendor,
  deleteVendor,
};
