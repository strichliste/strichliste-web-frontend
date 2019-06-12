import React from 'react';
import { withRouter } from 'react-router';
import { Block, Card, ResponsiveGrid, styled } from 'bricks-of-sand';
import { FormattedMessage } from 'react-intl';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from 'recharts';

import { Currency } from '../../currency';
import { UserRouteProps } from '../../user/user-router';
import { ArticleElement, useMetrics } from './resource';

type Props = UserRouteProps;

const H1 = styled('h1')({
  marginBottom: '2rem',
  fontSize: '1.5rem',
});

const TopRatedArticles = (props: { articles: ArticleElement[] }) => (
  <Block margin="1rem">
    <h2>
      <FormattedMessage
        id="METRICS_ARTICLES_RATING"
        defaultMessage="Your top 10 articles!"
      />
    </h2>
    <ResponsiveGrid gridGap="1rem" tabletColumns="1fr 1fr 2fr">
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
    </ResponsiveGrid>
    {props.articles.slice(0, 10).map(articleMetric => (
      <ResponsiveGrid
        gridGap="1rem"
        tabletColumns="1fr 1fr 2fr"
        key={articleMetric.article.id}
      >
        <div>{articleMetric.count}</div>
        <div>
          <Currency value={articleMetric.amount} />
        </div>
        <div>{articleMetric.article.name}</div>
      </ResponsiveGrid>
    ))}
  </Block>
);

const MetricCard = (props: {
  title: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card>
    <h2>{props.title}</h2>
    <Block>{props.children}</Block>
  </Card>
);

export const Metrics: React.FC<Props> = props => {
  const metrics = useMetrics(props.match.params.id);
  if (!metrics) {
    return null;
  }
  return (
    <Block margin="2rem 1rem">
      <H1>
        <FormattedMessage id="METRICS_HEADLINE" defaultMessage="metrics" />
      </H1>
      <ResponsiveGrid gridGap="1rem" columns="1fr 1fr">
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
      </ResponsiveGrid>
      <TopRatedArticles articles={metrics.articles} />
    </Block>
  );
};

// tslint:disable-next-line:no-default-export
export default withRouter(Metrics);
