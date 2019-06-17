import { Block } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'redux-react-hook';
import { useActiveArticles } from '../../store';
import { startLoadingArticles } from '../../store/reducers';
import { NavTabMenus } from '../common/nav-tab-menu';
import { ArticleForm } from './article-form';

export const ArticleList: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const articles = useActiveArticles(isActive);
  const dispatch = useDispatch();

  React.useEffect(() => {
    startLoadingArticles(dispatch, isActive);
  }, [dispatch]);

  return (
    <Block margin="1.5rem 1rem">
      <ArticleForm onCreated={() => ''}>
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
      </ArticleForm>
      {articles.map(article => (
        <ArticleForm
          articleId={article.id}
          key={article.id}
          onCreated={() => ''}
        />
      ))}
    </Block>
  );
};
