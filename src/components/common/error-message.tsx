import { FixedContainer } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { getGlobalError } from '../../store/reducers';
import { Toast } from './toast';

interface OwnProps {}

interface StateProps {
  id?: string;
}

interface ActionProps {}

export type ErrorMessageProps = ActionProps & StateProps & OwnProps;

export function ErrorMessage({ id }: ErrorMessageProps): JSX.Element | null {
  if (!id) {
    return null;
  }

  return (
    <FixedContainer bottom={0}>
      <Toast type="error" fadeOutSeconds={5}>
        <FormattedMessage id={id} />
      </Toast>
    </FixedContainer>
  );
}

const mapStateToProps = (state: AppState): StateProps => ({
  id: getGlobalError(state),
});

const mapDispatchToProps = {};

export const ConnectedErrorMessage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorMessage);
