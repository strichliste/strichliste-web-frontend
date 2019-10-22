import React from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

import { Currency } from '../../currency';
import { UserRouteProps } from '../../user/user-router';
import { ArticleMetric, useMetrics } from './resource';
import { Card, Separator, GridOneOneTwo } from '../../../bricks';

type Props = UserRouteProps;

const TopRatedArticles = (props: { articles: ArticleMetric[] }) => (
  <Card margin="2rem 0">
    <h2>
      <FormattedMessage
        id="METRICS_ARTICLES_RATING"
        defaultMessage="Your top 10 articles!"
      />
    </h2>
    <Separator margin="1rem -1rem 2rem -1rem" />
    <GridOneOneTwo>
      <div>
        <FormattedMessage id="USER_TRANSACTIONS_TABLE_AMOUNT" />
      </div>
      <div>
        <FormattedMessage
          id="USER_METRICS_PRICE"
          defaultMessage="money spend"
        />
      </div>
      <div>
        <FormattedMessage id="USER_METRICS_ARTICLE" defaultMessage="article" />
      </div>
      <div />
    </GridOneOneTwo>
    {props.articles.slice(0, 10).map(articleMetric => (
      <GridOneOneTwo key={articleMetric.article.id}>
        <div>{articleMetric.count}</div>
        <div>
          <Currency value={articleMetric.amount} />
        </div>
        <div>{articleMetric.article.name}</div>
      </GridOneOneTwo>
    ))}
  </Card>
);

const MetricCard = (props: {
  title: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card>
    <h2>{props.title}</h2>
    <div>{props.children}</div>
  </Card>
);

export const Metrics: React.FC<Props> = props => {
  const metrics = useMetrics(props.match.params.id);
  if (!metrics) {
    return null;
  }
  return (
    <div style={{ margin: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>
        <FormattedMessage id="METRICS_HEADLINE" defaultMessage="metrics" />
      </h1>
      <GridOneOneTwo>
        <MetricCard title={<FormattedMessage id="USER_TRANSACTIONS" />}>
          <div>
            <FormattedMessage id="USER_TRANSACTIONS_TABLE_AMOUNT" />:
            {metrics.transactions.count}
          </div>
          <div>
            <Currency value={metrics.transactions.incoming.amount} />
          </div>
          <div>
            <Currency value={metrics.transactions.outgoing.amount} />
          </div>
        </MetricCard>
        <MetricCard title={<FormattedMessage id="ARTICLE_HEADLINE" />}>
          <div>
            <FormattedMessage id="USER_TRANSACTIONS_TABLE_AMOUNT" />:
            {metrics.articles.length}
          </div>
        </MetricCard>
      </GridOneOneTwo>
      <TopRatedArticles articles={metrics.articles} />
    </div>
  );
};

// tslint:disable-next-line:no-default-export
export default withRouter(Metrics);
