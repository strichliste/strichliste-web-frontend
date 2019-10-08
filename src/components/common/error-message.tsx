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
    <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>
      <Toast type="error" fadeOutSeconds={5}>
        <FormattedMessage id={id} />
      </Toast>
    </div>
  );
}
