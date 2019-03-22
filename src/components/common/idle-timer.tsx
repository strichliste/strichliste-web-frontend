import * as React from 'react';
import { useSettings } from '../../store';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let timerId: any = 0;

export function useIdleTimer(onTimeOut: () => void) {
  const settings = useSettings();

  const resetTimer = () => {
    clearTimeout(timerId);
    timerId = setTimeout(onTimeOut, settings.common.idleTimer);
  };

  React.useEffect(() => {
    resetTimer();
    document.addEventListener('scroll', resetTimer);
    document.addEventListener('click', resetTimer);
    document.addEventListener('touch', resetTimer);
    document.addEventListener('keyup', resetTimer);
    return () => {
      document.removeEventListener('scroll', resetTimer);
      document.removeEventListener('click', resetTimer);
      document.removeEventListener('touch', resetTimer);
      document.removeEventListener('keyup', resetTimer);
      clearTimeout(timerId);
    };
  }, []);
}

export const WrappedIdleTimer = React.memo(
  withRouter((props: RouteComponentProps) => {
    useIdleTimer(() => props.history.push('/'));
    return null;
  })
);
