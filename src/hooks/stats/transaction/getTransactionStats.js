import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";

export default function useTransactionStats() {
    const MONTHS = useMemo(
        () => [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        []
    );

    const [transactionStats, setTransactionStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                // Fetch Drivers
                const transactionResponse = await axiosInstance.get(`/admin/transactions/stats`);
                const sortedTransactions = transactionResponse.data.sort((a, b) => a._id - b._id);
                setTransactionStats(
                    sortedTransactions.map((item) => ({
                        name: MONTHS[item._id - 1],
                        "New Transactions": item.total,
                    }))
                );
                
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [MONTHS]);

    return { transactionStats, loading };
}
