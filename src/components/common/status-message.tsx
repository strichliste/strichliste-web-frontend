import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  clearGlobalStatus,
  useGlobalStatus,
} from '../../services/global-status';

/**
 * Polite live region for transient success messages. Mounted once in the
 * Layout; consumers fire via `setGlobalStatus(id)`. The container is always
 * in the DOM so screen-readers see the change (mounting/unmounting a region
 * is silent to most ATs); the message clears itself after 4s.
 */
export function StatusMessage(): React.JSX.Element {
  const { id, key } = useGlobalStatus();

  React.useEffect(() => {
    if (!id) return;
    const handle = window.setTimeout(() => clearGlobalStatus(), 4000);
    return () => window.clearTimeout(handle);
  }, [id, key]);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {id ? <FormattedMessage id={id} /> : null}
    </div>
  );
}
