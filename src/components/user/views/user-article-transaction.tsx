import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Article, startCreatingTransaction } from '../../../store/reducers';
import { ConnectedArticleSelectionBubbles } from '../../article/article-selection-bubbles';
import { getUserDetailLink } from '../user-router';

interface ActionProps {
  startCreatingTransaction: // tslint:disable-next-line:no-any
  any;
}

export type UserArticleTransactionProps = ActionProps &
  RouteComponentProps<{ id: string }>;

export function UserArticleTransaction(
  props: UserArticleTransactionProps
): JSX.Element | null {
  return (
    <>
      <ConnectedArticleSelectionBubbles
        onCancel={() =>
          props.history.push(getUserDetailLink(Number(props.match.params.id)))
        }
        onSelect={article => onSelect(article, props)}
      />
    </>
  );
}

async function onSelect(
  article: Article,
  props: UserArticleTransactionProps
): Promise<void> {
  const result = await props.startCreatingTransaction(
    Number(props.match.params.id),
    {
      articleId: article.id,
    }
  );
  if (result) {
    props.history.goBack();
  }
}

const mapDispatchToProps = {
  startCreatingTransaction,
};

export const ConnectedUserArticleTransaction = connect(
  undefined,
  mapDispatchToProps
)(UserArticleTransaction);
