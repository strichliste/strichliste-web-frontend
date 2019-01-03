import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { getUserBalance } from '../../store/reducers';
import { ConnectedTransactionValidator } from './validator';

interface OwnProps {
  userId: number;
  targetUserId: number;
  value: number;
  render(isValid: boolean): JSX.Element;
}

interface StateProps {
  ownBalance: number;
  targetBalance: number;
}

export type UserToUserValidatorProps = StateProps & OwnProps;

export function UserToUserValidator(
  props: UserToUserValidatorProps
): JSX.Element | null {
  return (
    <ConnectedTransactionValidator
      userId={props.userId}
      value={props.value}
      isDeposit={false}
      render={userHasTheMoney => (
        <ConnectedTransactionValidator
          userId={props.targetUserId}
          value={props.value}
          isDeposit={true}
          render={receiverCanAcceptTheMoney => (
            <>{props.render(userHasTheMoney && receiverCanAcceptTheMoney)} </>
          )}
        />
      )}
    />
  );
}

const mapStateToProps = (state: AppState, props: OwnProps): StateProps => ({
  ownBalance: getUserBalance(state, props.userId),
  targetBalance: getUserBalance(state, props.userId),
});

export const ConnectedUserToUserValidator = connect(mapStateToProps)(
  UserToUserValidator
);
