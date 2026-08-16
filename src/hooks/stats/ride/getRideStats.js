import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";

export default function useRideStats() {
    const MONTHS = useMemo(
        () => [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        []
    );

    const [rideStats, setRideStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                // Fetch Drivers
                const rideResponse = await axiosInstance.get(`/admin/rides/stats`);
                const sortedRides = rideResponse.data.sort((a, b) => a._id - b._id);
                setRideStats(
                    sortedRides.map((item) => ({
                        name: MONTHS[item._id - 1],
                        "New Rides": item.total,
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

    return { rideStats, loading };
}
