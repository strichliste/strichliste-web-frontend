import * as React from 'react';
import { connect } from 'react-redux';

import { DefaultThunkAction } from '../../store';
import {
  CreateTransactionParams,
  startCreatingTransaction,
} from '../../store/reducers';
import { Currency } from '../currency';
import { Button } from '../ui';

interface OwnProps {
  userId: number;
  value: number;
  color?: string;
  disabled?: boolean;
}

interface ActionProps {
  startCreatingTransaction(
    userId: number,
    params: CreateTransactionParams
  ): DefaultThunkAction;
}

type Props = OwnProps & ActionProps;

export function TransactionButton(props: Props): JSX.Element {
  return (
    <Button
      color={props.color}
      onClick={() =>
        props.startCreatingTransaction(props.userId, { amount: props.value })
      }
      type="button"
      disabled={props.disabled}
    >
      <Currency value={props.value} />
    </Button>
  );
}

const mapDispatchToProps = {
  startCreatingTransaction,
};

export const ConnectedTransactionButton = connect(
  undefined,
  mapDispatchToProps
)(TransactionButton);
