import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { Boundary } from '../../store/reducers';
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
  boundary: Boundary;
}

export type UserToUserValidatorProps = StateProps & OwnProps;

export function UserToUserValidator(
  props: UserToUserValidatorProps
): JSX.Element | null {
  return (
    <>
      <ConnectedTransactionValidator
        boundary={props.boundary}
        userId={props.userId}
        value={props.value}
        isDeposit={false}
        render={userHasTheMoney => (
          <ConnectedTransactionValidator
            boundary={props.boundary}
            userId={props.targetUserId}
            value={props.value}
            isDeposit={true}
            render={receiverCanAcceptTheMoney => (
              <>{props.render(userHasTheMoney && receiverCanAcceptTheMoney)} </>
            )}
          />
        )}
      />
    </>
  );
}

const mapStateToProps = (state: AppState, props: OwnProps): StateProps => ({
  ownBalance: state.user[props.userId].balance,
  targetBalance: state.user[props.userId].balance,
  boundary: state.settings.account.boundary,
});

export const ConnectedUserToUserValidator = connect(mapStateToProps)(
  UserToUserValidator
);
