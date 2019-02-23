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
              {transaction.sender && <>&#8592; {transaction.sender.name} :</>}
              {transaction.recipient && (
                <>&#8594; {transaction.recipient.name} :</>
              )}
              {transaction.article && (
                <>
                  <ArticleIcon>
                    <ShoppingBagIcon />
                  </ArticleIcon>{' '}
                  {transaction.article.name}
                </>
              )}
              {transaction.comment && <> {transaction.comment}</>}
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
