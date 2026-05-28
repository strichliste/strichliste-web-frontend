import * as React from 'react';
import { Article } from '../../../types';
import { useCreateTransaction } from '../../../queries/transactions';
import { ArticleSelectionBubbles } from '../../article/article-selection-bubbles';
import { getUserDetailLink, UserRouteProps } from '../user-router';

type Props = UserRouteProps;

export function UserArticleTransaction(props: Props): React.JSX.Element | null {
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction();
  const userId = props.match.params.id;

  const handleSelect = async (article: Article): Promise<void> => {
    if (!article || isPending) return;
    try {
      await createTransaction({ userId, params: { articleId: article.id } });
      props.history.push(getUserDetailLink(userId));
    } catch {
      // mutationCache.onError surfaced a toast; stay on the article-pick view.
    }
  };

  return (
    <ArticleSelectionBubbles
      userId={userId}
      onCancel={() => props.history.push(getUserDetailLink(userId))}
      onSelect={handleSelect}
    />
  );
}
