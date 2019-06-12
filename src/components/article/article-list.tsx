import { Block } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'redux-react-hook';
import { useArticles } from '../../store';
import { startLoadingArticles } from '../../store/reducers';
import { NavTabMenus } from '../common/nav-tab-menu';
import { ArticleForm } from './article-form';

export const ArticleList: React.FC = () => {
  const articles = useArticles();
  const dispatch = useDispatch();

  React.useEffect(() => {
    startLoadingArticles(dispatch);
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
              to: '/articles',
              message: <FormattedMessage id="ARTICLE_HEADLINE" />,
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
