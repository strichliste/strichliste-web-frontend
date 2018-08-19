import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { Transaction } from '../../store/reducers';
import { Currency } from '../currency';
import { AlertText, Column, Ellipsis, ListItem, Row } from '../ui';

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
      <Row>
        <Column>
          <AlertText value={props.transaction.amount}>
            <Currency value={props.transaction.amount} />
          </AlertText>
        </Column>
        <Column>{props.transaction.created}</Column>
        <Column>
          <Ellipsis>
            {props.transaction.sender && (
              <>
                <FormattedMessage id="USER_TRANSACTIONS_SENDER" />:{' '}
                {props.transaction.sender.name}
              </>
            )}
          </Ellipsis>
        </Column>
        <Column>
          <Ellipsis>
            {props.transaction.recipient && (
              <>
                <FormattedMessage id="USER_TRANSACTIONS_RECIPIENT" />:{' '}
                {props.transaction.recipient.name}
              </>
            )}
          </Ellipsis>
        </Column>
      </Row>
    </ListItem>
  );
}

const mapStateToProps = (state: AppState, { id }: OwnProps) => ({
  transaction: state.transaction[id],
});

export const ConnectedTransactionListItem = connect(mapStateToProps)(
  TransactionListItem
);
