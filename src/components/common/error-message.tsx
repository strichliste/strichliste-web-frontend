import { FormattedMessage } from 'react-intl';
import { useGlobalError } from '../../services/global-error';
import { Toast } from './toast';

export function ErrorMessage() {
  const id = useGlobalError();

  if (!id) {
    return null;
  }

  return (
    // role="alert" already implies aria-live="assertive" + atomic; setting
    // aria-live explicitly was a redundant double-announce. Keep just the
    // role so AT clients pick the conventional behaviour.
    <div
      role="alert"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 600 }}
    >
      <Toast type="error" fadeOutSeconds={5}>
        <FormattedMessage id={id} />
      </Toast>
    </div>
  );
}
