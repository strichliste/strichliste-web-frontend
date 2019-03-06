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
            <Ellipsis>
              {transaction.sender && (
                <InLineLink to={getUserDetailLink(transaction.sender.id)}>
                  &#8592; {transaction.sender.name}
                </InLineLink>
              )}
              {transaction.recipient && (
                <InLineLink to={getUserDetailLink(transaction.recipient.id)}>
                  &#8594; {transaction.recipient.name}
                </InLineLink>
              )}
              {transaction.article && (
                <>
                  <ArticleIcon>
                    <ShoppingBagIcon />
                  </ArticleIcon>{' '}
                  {transaction.article.name}
                </>
              )}

              {transaction.comment && (
                <>
                  {transaction.comment &&
                    ((transaction.sender && transaction.sender.name) ||
                      (transaction.recipient && transaction.recipient.name)) &&
                    ':'}{' '}
                  {transaction.comment}
                </>
              )}
            </Ellipsis>
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
