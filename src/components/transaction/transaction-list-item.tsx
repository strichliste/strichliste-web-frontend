import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { Transaction } from '../../store/reducers';
import { Currency } from '../currency';
import { AlertText, Column, Ellipsis, LineThrough, ListItem, Row } from '../ui';
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
      <LineThrough lineThrough={props.transaction.deleted}>
        <Row>
          <Column grow={0} width="5rem">
            <AlertText value={props.transaction.amount}>
              <Currency value={props.transaction.amount} />
            </AlertText>
          </Column>
          <Column width="8rem" grow={1}>
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
          </Column>
          <Column grow={0} width="9rem">
            {props.transaction.isDeletable ? (
              <ConnectedTransactionUndoButton
                transactionId={props.transaction.id}
                userId={props.transaction.user.id}
              />
            ) : (
              <Ellipsis>{props.transaction.created}</Ellipsis>
            )}
          </Column>
        </Row>
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
