import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type DataArray = { timestamp: string; temp: number; moisture: number }[];

function App() {
  const [data, setData] = useState<DataArray>([]);
  const [timeframe, setTimeframe] = useState("5 Minutes");
  useEffect(() => {
    const getData = async () => {
      const data: DataArray = await fetch(
        `http://localhost:3000/data?timeframe=${timeframe}`
      ).then((res) => res.json());

      setData(
        data
          .map((t) => ({
            ...t,
            timestamp: new Date(t.timestamp).toLocaleTimeString(),
          }))
          .reverse()
      );
    };
    getData();
    const interval = setInterval(getData, 5000);
    return () => clearInterval(interval);
  }, [timeframe]);
  return (
    <div className="App">
      <select onChange={(e) => {}}>
        <option>5 Minutes</option>
        <option>1 Hour</option>
        <option>1 Day</option>
        <option>1 Week</option>
        <option>1 Month</option>
      </select>
      <div style={{ width: "600px", height: "337px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={600} height={300} data={data}>
            <Line
              type="monotone"
              yAxisId="left"
              dataKey="temp"
              stroke="#8884d8"
              dot={() => <span />}
            />
            <Line
              type="monotone"
              yAxisId="right"
              dataKey="moisture"
              stroke="#0088ff"
              dot={() => <span />}
            />
            <CartesianGrid stroke="#ccc" />
            <YAxis yAxisId="left" dataKey="temp" />
            <YAxis yAxisId="right" orientation="right" />
            <XAxis
              dataKey="timestamp"
              // tick={({ payload }) => (
              //   <span>{new Date(payload).toLocaleDateString()}</span>
              // )}
            />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
