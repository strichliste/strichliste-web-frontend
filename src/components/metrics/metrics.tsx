import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// import { Currency } from '../currency';
import { useMetrics } from './resource';

const Metrics: React.FC = () => {
  const metrics = useMetrics();

  if (!metrics) {
    return null;
  }
  return (
    <div style={{ margin: '2rem 0.5rem' }}>
      <h1>
        <FormattedMessage id="METRICS_HEADLINE" defaultMessage="metrics" />
      </h1>
      <h1>Balance</h1>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={metrics.days}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Metrics;
