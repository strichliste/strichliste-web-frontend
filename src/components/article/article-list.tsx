import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'redux-react-hook';
import { RouteComponentProps, withRouter } from 'react-router';

import { Block, PrimaryButton, AddIcon, Flex } from 'bricks-of-sand';

import { useActiveArticles } from '../../store';
import { startLoadingArticles, Article } from '../../store/reducers';
import { NavTabMenus } from '../common/nav-tab-menu';
import { InfiniteList } from '../common/search-list/search-list';
import { Link } from 'react-router-dom';
import { getArticleFormRoute } from './article-router';
import { Currency } from '../currency';

//@ts-ignore
import styles from './article-list.module.css';

const ArticleListItem: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <Link className={styles.list} to={getArticleFormRoute(article.id)}>
      {article.name} <Currency hidePlusSign value={article.amount} />
    </Link>
  );
};

const AddArticleButton: any = withRouter(props => {
  return (
    <PrimaryButton
      margin="0 1rem 0 0"
      onClick={() => props.history.push('/articles/add')}
      isRound
    >
      <AddIcon />
    </PrimaryButton>
  );
});

export const ArticleList: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const articles = useActiveArticles(isActive);
  const dispatch = useDispatch();

  React.useEffect(() => {
    startLoadingArticles(dispatch, isActive);
  }, [dispatch, isActive]);

  return (
    <Block margin="1.5rem 1rem">
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
      <InfiniteList
        items={articles}
        renderItem={(article: Article) => (
          <ArticleListItem key={article.id} article={article} />
        )}
        pageSize={10}
      />
    </div>
  );
};
