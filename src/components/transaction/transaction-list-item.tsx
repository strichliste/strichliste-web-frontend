import {
  AlertText,
  Ellipsis,
  LineThrough,
  ListItem,
  ResponsiveGrid,
  Theme,
  withTheme,
} from 'bricks-of-sand';
import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { Transaction } from '../../store/reducers';
import { Currency } from '../currency';
import { ShoppingBagIcon } from '../ui/icons/shopping-bag';
import { ConnectedTransactionUndoButton } from './transaction-undo-button';

const ArticleIcon = withTheme(
  styled('span')({}, ({ theme }) => ({
    fill: (theme as Theme).primary,
  }))
);

interface OwnProps {
  id: number | string;
}

interface StateProps {
  transaction: Transaction;
}

type Props = OwnProps & StateProps;

const TextRight = styled(ResponsiveGrid)({
  textAlign: 'right',
});

export function TransactionListItem(props: Props): JSX.Element | null {
  if (!props.transaction) {
    return null;
  }
  return (
    <ListItem>
      <LineThrough lineThrough={props.transaction.isDeleted}>
        <ResponsiveGrid gridGap="0" margin="0" columns="2fr 1fr">
          <ResponsiveGrid
            gridGap="0"
            margin="0"
            columns="1fr"
            tabletColumns="1fr 1fr"
          >
            <AlertText value={props.transaction.amount}>
              <Currency value={props.transaction.amount} />
            </AlertText>
            <Ellipsis>
              {props.transaction.sender && (
                <>&#8592; {props.transaction.sender.name}</>
              )}
              {props.transaction.recipient && (
                <>&#8594; {props.transaction.recipient.name}</>
              )}
              {props.transaction.article && (
                <>
                  <ArticleIcon>
                    <ShoppingBagIcon />
                  </ArticleIcon>{' '}
                  {props.transaction.article.name}
                </>
              )}
              {props.transaction.comment && <>: {props.transaction.comment}</>}
            </Ellipsis>
          </ResponsiveGrid>
          <TextRight>
            {props.transaction.isDeletable ? (
              <ConnectedTransactionUndoButton
                transactionId={props.transaction.id}
                userId={props.transaction.user.id}
              />
            ) : (
              <Ellipsis>{props.transaction.created}</Ellipsis>
            )}
          </TextRight>
        </ResponsiveGrid>
      </LineThrough>
    </ListItem>
  );
}

const mapStateToProps = (state: AppState, { id }: OwnProps) => ({
  transaction: state.transaction[id],
});

export const ConnectedTransactionListItem = connect(mapStateToProps)(
  TransactionListItem
);
