import { FixedContainer } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useGlobalError } from '../../store';
import { Toast } from './toast';

interface OwnProps {}

interface StateProps {
  id?: string;
}

interface ActionProps {}

export type ErrorMessageProps = ActionProps & StateProps & OwnProps;

export function ErrorMessage() {
  const id = useGlobalError();

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
