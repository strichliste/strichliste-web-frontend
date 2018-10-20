import { ResponsiveGrid } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { Transaction } from '../../store/reducers';
import { Currency } from '../currency';
import { AlertText, Ellipsis, LineThrough, ListItem } from '../ui';
import { ConnectedTransactionUndoButton } from './transaction-undo-button';

interface OwnProps {
  id: number | string;
}

interface StateProps {
  transaction: Transaction;
}

type Props = OwnProps & StateProps;

export function TransactionListItem(props: Props): JSX.Element | null {
  if (!props.transaction) {
    return null;
  }
  return (
    <ListItem>
      <LineThrough lineThrough={props.transaction.isDeleted}>
        <ResponsiveGrid margin="0" columns="2fr 1fr">
          <ResponsiveGrid margin="0" columns="1fr" tabletColumns="1fr 1fr">
            <AlertText value={props.transaction.amount}>
              <Currency value={props.transaction.amount} />
            </AlertText>
            <Ellipsis>
              {props.transaction.sender && (
                <>
                  <FormattedMessage id="USER_TRANSACTIONS_SENDER" />:{' '}
                  {props.transaction.sender.name}
                </>
              )}
              {props.transaction.recipient && (
                <>
                  <FormattedMessage id="USER_TRANSACTIONS_RECIPIENT" />:{' '}
                  {props.transaction.recipient.name}
                </>
              )}
              {props.transaction.article && (
                <>{props.transaction.article.name}</>
              )}
            </Ellipsis>
          </ResponsiveGrid>
          {props.transaction.isDeletable ? (
            <ConnectedTransactionUndoButton
              transactionId={props.transaction.id}
              userId={props.transaction.user.id}
            />
          ) : (
            <Ellipsis>{props.transaction.created}</Ellipsis>
          )}
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
