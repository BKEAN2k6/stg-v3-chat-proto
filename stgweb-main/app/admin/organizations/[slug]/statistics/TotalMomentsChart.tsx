'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export const TotalMomentsChart = (props: any) => {
  const {chartData} = props;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis hide />
        <Tooltip />
        <Line type="monotone" dataKey="strengthsSeen" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};
