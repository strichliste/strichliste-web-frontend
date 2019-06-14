import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// import { Currency } from '../currency';
import { useMetrics } from './resource';
import { Separator, Card, ResponsiveGrid, AlertText } from 'bricks-of-sand';
import { Currency } from '../currency';

const Metrics: React.FC = () => {
  const metrics = useMetrics();

  if (!metrics) {
    return null;
  }
  return (
    <div style={{ margin: '0 1rem' }}>
      <ResponsiveGrid margin="2rem 0" columns="1fr 1fr 1fr">
        <Card margin="1rem 1rem 1rem 0">
          <h2>
            <FormattedMessage id="METRICS_BALANCE" defaultMessage="balance" />
          </h2>
          <AlertText value={metrics.balance}>
            <Currency hidePlusSign value={metrics.balance} />
          </AlertText>
        </Card>
        <Card margin="1rem 1rem 1rem 1rem">
          <h2>
            <FormattedMessage id="METRICS_USER_COUNT" defaultMessage="users" />
          </h2>
          <FormattedNumber value={metrics.userCount} />
        </Card>
        <Card margin="1rem 0 1rem 1rem">
          <h2>
            <FormattedMessage
              id="METRICS_TRANSACTION_COUNT"
              defaultMessage="transactions"
            />
          </h2>

          <FormattedNumber value={metrics.transactionCount} />
        </Card>
      </ResponsiveGrid>
      <Card>
        <h2>
          <FormattedMessage id="METRICS_BALANCE" defaultMessage="balance" />
        </h2>
        <Separator margin="1rem -1rem 2rem -1rem" />
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={metrics.days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card margin="1rem 0">
        <h2>
          <FormattedMessage id="METRICS_USERS" defaultMessage="Users" />
        </h2>
        <Separator margin="1rem -1rem 2rem -1rem" />
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={metrics.days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Metrics;
