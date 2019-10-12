import * as React from 'react';
import { Currency } from '../currency';
import { ShoppingBagIcon } from '../ui/icons/shopping-bag';
import { TransactionUndoButton } from './transaction-undo-button';
import { useTransaction } from '../../store';
import { getUserDetailLink } from '../user/user-router';
import { Link } from 'react-router-dom';
import { User, Article } from '../../store/reducers';
import { Ellipsis, LineThrough, AlertText, ListItem } from '../../bricks';

import styles from './transaction-list-item.module.css';

interface ListItemProps {
  user?: User;
  article?: Article;
  isSender: boolean;
  comment?: string;
}

const ListItemDescription = ({
  user,
  article,
  isSender,
  comment,
}: ListItemProps) => {
  const composedComment = (user && comment ? ':' : '') + (comment || '');
  const title =
    (article ? article.name : '') + (user ? user.name : '') + composedComment;
  return (
    <Ellipsis title={title}>
      {user && (
        <Link to={getUserDetailLink(user.id)}>
          {isSender ? <>&#8592;</> : <>&#8594;</>} {user.name}
        </Link>
      )}
      {article && (
        <>
          <ShoppingBagIcon />
          {article.name}
        </>
      )}
      {composedComment}
    </Ellipsis>
  );
};

export function TransactionListItem({
  id,
  first,
}: {
  id: string;
  first?: boolean;
}): JSX.Element | null {
  const transaction = useTransaction(Number(id));
  if (!transaction) {
    return null;
  }
  return (
    <ListItem borderTop>
      <LineThrough lineThrough={transaction.isDeleted}>
        <div className={styles.grid}>
          <div className={styles.grow}>
            <AlertText
              style={{ marginRight: '1rem' }}
              value={transaction.amount}
            >
              <Currency value={transaction.amount} />
            </AlertText>
            <ListItemDescription
              article={transaction.article}
              isSender={!!transaction.sender}
              comment={transaction.comment}
              user={transaction.sender || transaction.recipient}
            />
          </div>
          <div className={styles.textRight}>
            {transaction.isDeletable ? (
              <TransactionUndoButton
                transactionId={transaction.id}
                userId={transaction.user.id}
              />
            ) : (
              <Ellipsis>{transaction.created}</Ellipsis>
            )}
          </div>
        </div>
      </LineThrough>
    </ListItem>
  );
}
