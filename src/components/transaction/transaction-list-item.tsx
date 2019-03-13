import {
  AlertText,
  Ellipsis,
  LineThrough,
  ListItem,
  ResponsiveGrid,
  Theme,
  styled,
  withTheme,
} from 'bricks-of-sand';
import * as React from 'react';
import { Currency } from '../currency';
import { ShoppingBagIcon } from '../ui/icons/shopping-bag';
import { TransactionUndoButton } from './transaction-undo-button';
import { useTransaction } from '../../store';
import { getUserDetailLink } from '../user/user-router';
import { Link } from 'react-router-dom';
import { User, Article } from '../../store/reducers';

const InLineLink = styled(Link)({
  display: 'inline !important',
});

const ArticleIcon = withTheme(
  styled('span')({}, ({ theme }) => ({
    fill: (theme as Theme).primary,
  }))
);

interface Props {
  id: number | string;
}

const TextRight = styled(ResponsiveGrid)({
  textAlign: 'right',
});

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
        <InLineLink to={getUserDetailLink(user.id)}>
          {isSender ? <>&#8592;</> : <>&#8594;</>} {user.name}
        </InLineLink>
      )}
      {article && (
        <>
          <ArticleIcon>
            <ShoppingBagIcon />
          </ArticleIcon>{' '}
          {article.name}
        </>
      )}
      {composedComment}
    </Ellipsis>
  );
};

export function TransactionListItem({ id }: Props): JSX.Element | null {
  const transaction = useTransaction(Number(id));
  if (!transaction) {
    return null;
  }
  return (
    <ListItem>
      <LineThrough lineThrough={transaction.isDeleted}>
        <ResponsiveGrid gridGap="0" margin="0" columns="2fr 1fr">
          <ResponsiveGrid
            gridGap="0"
            margin="0"
            columns="1fr"
            tabletColumns="1fr 1fr"
          >
            <AlertText value={transaction.amount}>
              <Currency value={transaction.amount} />
            </AlertText>
            <ListItemDescription
              article={transaction.article}
              isSender={!!transaction.sender}
              comment={transaction.comment}
              user={transaction.sender || transaction.recipient}
            />
          </ResponsiveGrid>
          <TextRight>
            {transaction.isDeletable ? (
              <TransactionUndoButton
                transactionId={transaction.id}
                userId={transaction.user.id}
              />
            ) : (
              <Ellipsis>{transaction.created}</Ellipsis>
            )}
          </TextRight>
        </ResponsiveGrid>
      </LineThrough>
    </ListItem>
  );
}
