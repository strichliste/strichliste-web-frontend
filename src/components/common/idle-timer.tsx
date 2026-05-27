import * as React from 'react';
import { useSettings } from '../../store';
import { RouteComponentProps, withRouter } from '../../routing';

export function useIdleTimer(onTimeOut: () => void) {
  const timeout = useSettings().common.idleTimeout;
  const timerId = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  React.useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timerId.current);
      timerId.current = setTimeout(onTimeOut, timeout);
    };
    resetTimer();
    const events = ['scroll', 'click', 'touch', 'keyup'];
    events.forEach((event) => document.addEventListener(event, resetTimer));
    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, resetTimer)
      );
      clearTimeout(timerId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeout]);
}

const IdleTimer = (props: RouteComponentProps) => {
  useIdleTimer(() => props.history.push('/'));
  return null;
};

export const WrappedIdleTimer = React.memo(withRouter(IdleTimer));
