import { FormattedMessage } from 'react-intl';
import { useGlobalError } from '../../services/global-error';
import { Toast } from './toast';

export function ErrorMessage() {
  const id = useGlobalError();

  if (!id) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 600 }}
    >
      <Toast type="error" fadeOutSeconds={5}>
        <FormattedMessage id={id} />
      </Toast>
    </div>
  );
}
