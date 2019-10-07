import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import {
  BarChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from 'recharts';
import { Separator, ResponsiveGrid, AlertText } from 'bricks-of-sand';

import { useMetrics } from './resource';
import { Currency } from '../currency';
import { Card } from '../../bricks';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FixedTooltip: any = Tooltip;

const Metrics: React.FC = () => {
  const theme = window.localStorage.getItem('SELECTED_THEME');
  const metrics = useMetrics();
  const stroke = theme === 'dark' ? 'white' : 'black';
  const background = theme === 'dark' ? '#2E3D4D' : 'white';

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
          <ComposedChart data={metrics.days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <FixedTooltip contentStyle={{ background }} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke={stroke}
              activeDot={{ r: 8 }}
            />
            <Bar dataKey="charged" barSize={20} fill="#00cc1d" />
            <Bar dataKey="spent" barSize={20} fill="#f54963" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
      <Card margin="1rem 0">
        <h2>
          <FormattedMessage id="METRICS_USERS" defaultMessage="Users" />
        </h2>
        <Separator margin="1rem -1rem 2rem -1rem" />
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={metrics.days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <FixedTooltip contentStyle={{ background }} />
            <Bar dataKey="distinctUsers" fill="#00cc1d" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Metrics;
