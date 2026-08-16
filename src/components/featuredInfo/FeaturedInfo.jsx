import { useEffect, useState } from "react";
import "./featuredInfo.css";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import { CurrencyRupeeRounded, ReceiptLongRounded } from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";

export default function FeaturedInfo({ number }) {
  const [data, setData] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    revenueThisMonth: 0,
    transactionsThisMonth: 0,
    revenueLastMonth: 0,
    transactionsLastMonth: 0,
    revenueChange: 0,
    transactionsChange: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/admin/transactions-info", { withCredentials: true });
        setData(res.data);
      } catch (err) {
        console.error("Featured info fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const renderCard = (title, value, isRevenue, change = null) => (
    <div className="featuredItem" key={title}>
      <div className="featuredTitleContainer">
        <div className="featuredTitleGroup">
          <span className={`featuredIconChip ${isRevenue ? "featuredIconChip--green" : "featuredIconChip--blue"}`}>
            {isRevenue ? <CurrencyRupeeRounded /> : <ReceiptLongRounded />}
          </span>
          <span className="featuredTitle">{title}</span>
        </div>
        {change !== null && <span className="featuredSub">vs last month</span>}
      </div>

      <div className="featuredMoneyContainer">
        <span className="featuredMoney">{value}</span>
        {change !== null && (
          <span className={`featuredMoneyRate ${change >= 0 ? "up" : "down"}`}>
            {change >= 0 ? <ArrowUpward className="featuredIcon" /> : <ArrowDownward className="featuredIcon" />}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );

  const transactionStats = [
    { title: "Revenue This Month", value: `₹${data.revenueThisMonth}`, isRevenue: true, change: data.revenueChange },
    { title: "Transactions This Month", value: data.transactionsThisMonth, isRevenue: false, change: data.transactionsChange },
    { title: "Revenue Last Month", value: `₹${data.revenueLastMonth}`, isRevenue: true },
    { title: "Transactions Last Month", value: data.transactionsLastMonth, isRevenue: false },
    { title: "Total Revenue", value: `₹${data.totalRevenue}`, isRevenue: true },
    { title: "Total Transactions", value: data.totalTransactions, isRevenue: false },
  ];

  const displayedStats = transactionStats.slice(0, number);

  return (
    <div className="featured">
      {displayedStats.map((item) =>
        renderCard(item.title, item.value, item.isRevenue, item.change ?? null)
      )}
    </div>
  );
}