import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosConfig";
import InvoiceApprove from "./InvoiceApprove";

export default function InvoiceView() {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
       axiosInstance.get(`/fm/invoices/${id}`).then(res => setData(res.data));
    }, [id]);

    if (!data) return null;

    return (
        <div>
            <h3>Invoice #{data.invoice.invoice_number}</h3>
            <p>Total: ₹{data.invoice.total_amount}</p>

            <h4>Approval Timeline</h4>
            <ul>
                {data.approvals.map(a => (
                    <li key={a.approval_id}>
                        Level {a.level_no} – {a.status}
                    </li>
                ))}
            </ul>

            <InvoiceApprove
                invoiceId={id}
                canApprove={data.canApprove}
            />
        </div>
    );
}
