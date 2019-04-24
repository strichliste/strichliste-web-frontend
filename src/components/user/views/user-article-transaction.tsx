import * as React from 'react';
import { Article, startCreatingTransaction } from '../../../store/reducers';
import { ArticleSelectionBubbles } from '../../article/article-selection-bubbles';
import { getUserDetailLink, UserRouteProps } from '../user-router';
import { useDispatch } from 'redux-react-hook';
import { Dispatch } from '../../../store/store';

async function onSelect(
  dispatch: Dispatch,
  article: Article,
  props: Props
): Promise<void> {
  if (!article) return;
  const result = await startCreatingTransaction(
    dispatch,
    props.match.params.id,
    {
      articleId: article.id,
    }
  );
  if (result) {
    props.history.push(getUserDetailLink(props.match.params.id));
  }
}

type Props = UserRouteProps;

export function UserArticleTransaction(props: Props): JSX.Element | null {
  const dispatch = useDispatch();

  return (
    <ArticleSelectionBubbles
      userId={props.match.params.id}
      onCancel={() =>
        props.history.push(getUserDetailLink(props.match.params.id))
      }
      onSelect={article => onSelect(dispatch, article, props)}
    />
  );
}
