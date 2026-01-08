import axiosInstance from "@/lib/axiosConfig";

export default function InvoiceApprove({ invoiceId, canApprove }) {
    if (!canApprove) return null;

    const approve = async () => {
        await axiosInstance.post(`/fm/invoices/${invoiceId}/approve`);
        alert("Invoice Approved");
    };

    return <button onClick={approve}>Approve</button>;
}
