import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { Transaction } from '../../store/reducers';
import { Currency } from '../currency';
import { AlertText, Ellipsis } from '../ui';

interface OwnProps {
  id: number | string;
}

interface StateProps {
  transaction: Transaction;
}

type Props = OwnProps & StateProps;

export function TransactionRowItem(props: Props): JSX.Element | null {
  if (!props.transaction) {
    return null;
  }
  return (
    <tr>
      <td>
        <AlertText value={props.transaction.amount}>
          <Currency value={props.transaction.amount} />
        </AlertText>
      </td>
      <td>
        <Ellipsis>
          {props.transaction.sender ? props.transaction.sender.name : ''}
        </Ellipsis>
      </td>
      <td>
        <Ellipsis>
          {props.transaction.recipient ? props.transaction.recipient.name : ''}
        </Ellipsis>
      </td>
      <td>{props.transaction.created}</td>
      <td>{props.transaction.article ? props.transaction.article.name : ''}</td>
      <td>{props.transaction.comment ? props.transaction.comment : ''}</td>
    </tr>
  );
}

const mapStateToProps = (state: AppState, { id }: OwnProps) => ({
  transaction: state.transaction[id],
});

export const ConnectedTransactionRowItem = connect(mapStateToProps)(
  TransactionRowItem
);
