import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import {
  Article,
  CreateTransactionParams,
  startCreatingTransaction,
} from '../../../store/reducers';
import { ConnectedArticleSearchList } from '../../article/article-search-list';
import { BackButton } from '../../common';
import { FixedFooter } from '../../ui';

interface ActionProps {
  startCreatingTransaction(
    userId: number,
    params: CreateTransactionParams
  ): // tslint:disable-next-line:no-any
  any;
}

export type UserArticleTransactionProps = ActionProps &
  RouteComponentProps<{ id: string }>;

export function UserArticleTransaction(
  props: UserArticleTransactionProps
): JSX.Element | null {
  return (
    <>
      <ConnectedArticleSearchList
        onSelect={article => onSelect(article, props)}
      />
      <FixedFooter>
        <BackButton />
      </FixedFooter>
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
      amount: article.amount,
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
