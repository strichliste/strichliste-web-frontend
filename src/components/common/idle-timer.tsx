import * as React from 'react';
import { useSettings } from '../../store';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';

export function useIdleTimer(onTimeOut: () => void) {
  const settings = useSettings();
  const [timerId, setTimerId] = React.useState(0);
  const resetTimer = () => {
    clearTimeout(timerId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id: any = setTimeout(onTimeOut, settings.idleTimer);
    setTimerId(id);
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

export const WrappedIdleTimer = withRouter((props: RouteComponentProps) => {
  useIdleTimer(() => props.history.push('/'));
  return null;
});
