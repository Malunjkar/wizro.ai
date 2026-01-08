import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosConfig";

export default function InvoiceWorkflowConfig() {
    const [roles, setRoles] = useState([]);
    const [workflow, setWorkflow] = useState({
        minAmount: "",
        maxAmount: ""
    });
    const [levels, setLevels] = useState([]);

    // 1️⃣ Roles fetch (from tbl_role_master)
    useEffect(() => {
        axios.get("/roles").then(res => setRoles(res.data));
    }, []);

    // 2️⃣ Add new approval level
    const addLevel = () => {
        setLevels([
            ...levels,
            { levelNo: levels.length + 1, roleId: "" }
        ]);
    };

    // 3️⃣ Update level role
    const updateLevelRole = (index, roleId) => {
        const updated = [...levels];
        updated[index].roleId = roleId;
        setLevels(updated);
    };

    // 4️⃣ Save workflow
    const saveWorkflow = async () => {
        if (!workflow.minAmount || !workflow.maxAmount || levels.length === 0) {
            alert("Please complete workflow details");
            return;
        }

        const payload = {
            module: "INVOICE",
            minAmount: Number(workflow.minAmount),
            maxAmount: Number(workflow.maxAmount),
            levels
        };

        await axiosInstance.post("/fm/workflows", payload);
        alert("Workflow saved successfully");

        // reset
        setWorkflow({ minAmount: "", maxAmount: "" });
        setLevels([]);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Invoice Approval Workflow Configuration</h2>

            {/* Amount Range */}
            <div>
                <label>Min Amount</label><br />
                <input
                    type="number"
                    value={workflow.minAmount}
                    onChange={e =>
                        setWorkflow({ ...workflow, minAmount: e.target.value })
                    }
                />
            </div>

            <div>
                <label>Max Amount</label><br />
                <input
                    type="number"
                    value={workflow.maxAmount}
                    onChange={e =>
                        setWorkflow({ ...workflow, maxAmount: e.target.value })
                    }
                />
            </div>

            <hr />

            {/* Approval Levels */}
            <h4>Approval Levels</h4>

            {levels.map((lvl, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                    <span>Level {lvl.levelNo}</span>{" "}
                    <select
                        value={lvl.roleId}
                        onChange={e => updateLevelRole(index, e.target.value)}
                    >
                        <option value="">Select Role</option>
                        {roles.map(r => (
                            <option key={r.role_id} value={r.role_id}>
                                {r.role_name}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            <button onClick={addLevel}>+ Add Approval Level</button>

            <br /><br />

            <button onClick={saveWorkflow}>
                Save Workflow
            </button>
        </div>
    );
}
