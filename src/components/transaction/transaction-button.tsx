import * as React from 'react';
import { connect } from 'react-redux';

import { GreenButton, RedButton } from 'bricks-of-sand';
import { startCreatingTransaction } from '../../store/reducers';
import { Currency } from '../currency';

interface OwnProps {
  userId: number;
  value: number;
  isDeposit?: boolean;
  disabled?: boolean;
}

interface ActionProps {
  // tslint:disable-next-line:no-any
  startCreatingTransaction: any;
}

type Props = OwnProps & ActionProps;

export function TransactionButton(props: Props): JSX.Element {
  const Button = props.isDeposit ? GreenButton : RedButton;

  return (
    <Button
      padding="0.8rem 0.5rem"
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
