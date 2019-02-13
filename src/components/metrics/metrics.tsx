import React from 'react';
import { withRouter } from 'react-router';

import { Block, Card, ResponsiveGrid } from 'bricks-of-sand';
import { FormattedMessage } from 'react-intl';
import { useMetrics } from '.';
import { Currency } from '../currency';
import { UserRouteProps } from '../user/user-router';

interface Props extends UserRouteProps {}

export const Metrics: React.FC<Props> = props => {
  const metrics = useMetrics(props.match.params.id);
  if (!metrics) {
    return null;
  }
  return (
    <Block margin="2rem 1rem">
      <ResponsiveGrid gridGap="1rem" columns="1fr 1fr">
        <Card>
          <FormattedMessage id="USER_TRANSACTIONS" />
          <div>{metrics.transactions.count}</div>
          <div>
            <Currency value={metrics.transactions.incoming.amount} />
          </div>
          <div>
            <Currency value={metrics.transactions.outgoing.amount} />
          </div>
        </Card>
        <Card>
          <FormattedMessage id="ARTICLE_HEADLINE" />
          <div>{metrics.articles.length}</div>
        </Card>
      </ResponsiveGrid>
    </Block>
  );
};

export const MetricsView = withRouter(Metrics);
