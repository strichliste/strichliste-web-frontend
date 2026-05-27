import * as React from 'react';
import { Article } from '../../../store/reducers';
import { createTransaction } from '../../../queries/transactions';
import { ArticleSelectionBubbles } from '../../article/article-selection-bubbles';
import { getUserDetailLink, UserRouteProps } from '../user-router';

async function onSelect(article: Article, props: Props): Promise<void> {
  if (!article) return;
  const result = await createTransaction(props.match.params.id, {
    articleId: article.id,
  });
  if (result) {
    props.history.push(getUserDetailLink(props.match.params.id));
  }
}

type Props = UserRouteProps;

export function UserArticleTransaction(props: Props): React.JSX.Element | null {
  return (
    <ArticleSelectionBubbles
      userId={props.match.params.id}
      onCancel={() =>
        props.history.push(getUserDetailLink(props.match.params.id))
      }
      onSelect={(article) => onSelect(article, props)}
    />
  );
}
