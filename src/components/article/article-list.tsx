import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { withRouter } from '../../routing';

import { useArticles } from '../../queries';
import { Article } from '../../types';
import { NavTabMenus } from '../common/nav-tab-menu';
import { SearchList } from '../common/search-list/search-list';
import { Link } from 'react-router-dom';
import { getArticleFormRoute } from './article-router';
import { Currency } from '../currency';
import { ArticleTagFilter } from './article-tag-filter';

import styles from './article-list.module.css';
import { Button, AddIcon, Flex } from '../../bricks';

const ArticleListItem: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <Link className={styles.list} to={getArticleFormRoute(article.id)}>
      <span>{article.name}</span>
      <span>
        <Currency hidePlusSign value={article.amount} />
      </span>
    </Link>
  );
};

const AddArticleButton = withRouter((props) => {
  const intl = useIntl();
  return (
    <Button
      highlight
      title={intl.formatMessage({ id: 'ARTICLE_ADD_LINK' })}
      margin="0 1rem 0 0"
      onClick={() => props.history.push('/articles/add')}
      fab
    >
      <AddIcon />
    </Button>
  );
});

export const ArticleList: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const articles = useArticles(isActive);
  const [filters, setFilters] = React.useState<string[]>([]);

  const handleFilterChange = (filters: Record<string, string>) => {
    const filterQueries = Object.values(filters);
    setFilters(filterQueries);
  };

  const filterArticles = () => {
    if (filters.length) {
      return articles.filter((article) =>
        article.tags.some(({ tag }) => filters.includes(tag))
      );
    }
    return articles;
  };

  return (
    <div style={{ margin: '1.5rem 1rem' }}>
      <Flex alignContent="center" alignItems="center">
        <AddArticleButton />
        <NavTabMenus
          margin="0.5rem 0"
          breakpoint={0}
          label={<FormattedMessage id="ARTICLE_HEADLINE" />}
          tabs={[
            {
              to: '/articles/active',
              message: <FormattedMessage id="ARTICLE_ACTIVE_HEADLINE" />,
            },
            {
              to: '/articles/inactive',
              message: <FormattedMessage id="ARTICLE_INACTIVE_HEADLINE" />,
            },
          ]}
        />
      </Flex>
      <h2 className="sr-only">
        <FormattedMessage
          id={isActive ? 'ARTICLE_ACTIVE_HEADLINE' : 'ARTICLE_INACTIVE_HEADLINE'}
        />
      </h2>
      <ArticleTagFilter onFilterChange={handleFilterChange} />
      <SearchList
        items={filterArticles()}
        renderItem={(article: Article) => (
          <ArticleListItem key={article.id} article={article} />
        )}
        pageSize={10}
      />
    </div>
  );
};
