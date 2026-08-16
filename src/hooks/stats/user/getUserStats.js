import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";

export default function useUserStats() {
  const MONTHS = useMemo(
    () => [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    []
  );

  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch Users
        const userResponse = await axiosInstance.get(`/admin/users/stats`);
        const sortedUsers = userResponse.data.sort((a, b) => a._id - b._id);
        setUserStats(
          sortedUsers.map((item) => ({
            name: MONTHS[item._id - 1],
            "New Users": item.total,
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

  return { userStats, loading };
}
