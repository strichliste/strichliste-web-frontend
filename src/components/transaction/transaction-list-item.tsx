import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { Transaction } from '../../store/reducers';
import { Currency } from '../currency';
import { AlertText, Column, ListItem, Row } from '../ui';

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
