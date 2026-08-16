import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import "./home.css";
import useUserStats from "../../hooks/stats/user/getUserStats";
import useDriverStats from "../../hooks/stats/driver/getDriverStats";
import useRideStats from "../../hooks/stats/ride/getRideStats";
import useTransactionStats from "../../hooks/stats/transaction/getTransactionStats";

export default function Home() {
  const { userStats } = useUserStats();
  const { driverStats } = useDriverStats();
  const { rideStats } = useRideStats();
  const { transactionStats } = useTransactionStats();

  return (
    <div className="home">
      <FeaturedInfo number={4} />

      <Chart data={userStats} title="User Analytics" grid dataKey="New Users" accent="blue" />
      <Chart data={driverStats} title="Driver Analytics" grid dataKey="New Drivers" accent="violet" />
      <Chart data={rideStats} title="Ride Analytics" grid dataKey="New Rides" accent="amber" />
      <Chart data={transactionStats} title="Transaction Analytics" grid dataKey="New Transactions" accent="green" />

      <div className="homeWidgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  );
}