import "./chart.css";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ACCENTS = {
  blue: "#2F5CFF",
  violet: "#7C5CFF",
  green: "#12B76A",
  amber: "#F79009",
};

export default function Chart({ title, data, dataKey, grid, accent = "blue" }) {
  const color = ACCENTS[accent] || ACCENTS.blue;

  return (
    <div className="chart">
      <div className="chartHeader">
        <h3 className="chartTitle">{title}</h3>
        <span className="chartDot" style={{ background: color }} />
      </div>

      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          {grid && <CartesianGrid stroke="#EEF1F6" strokeDasharray="4 4" vertical={false} />}
          <XAxis
            dataKey="name"
            stroke="#98A2B3"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              border: "1px solid #E4E7EC",
              borderRadius: 10,
              fontSize: 13,
              boxShadow: "0 8px 24px rgba(16,24,40,0.12)",
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}