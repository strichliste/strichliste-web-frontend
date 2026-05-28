import * as React from 'react';
import { Card } from '../../bricks';

interface Props {
  children?: React.ReactNode;
  type?: 'error';
  fadeOutSeconds: number;
  onFadeOut?(): void;
}

export function Toast({
  children,
  type,
  fadeOutSeconds,
  onFadeOut,
}: Props): React.JSX.Element | null {
  const [isVisible, setVisible] = React.useState(true);

  // Keep the latest onFadeOut in a ref so callers can pass an inline closure
  // (e.g. <Toast onFadeOut={resetState} />) without restarting the timer on
  // every parent render — the old class component started the timer once in
  // componentDidMount; this preserves that semantic.
  const onFadeOutRef = React.useRef(onFadeOut);
  React.useEffect(() => {
    onFadeOutRef.current = onFadeOut;
  }, [onFadeOut]);

  React.useEffect(() => {
    const id = setTimeout(() => {
      setVisible(false);
      onFadeOutRef.current?.();
    }, fadeOutSeconds * 1000);
    return () => clearTimeout(id);
  }, [fadeOutSeconds]);

  if (!isVisible) {
    return null;
  }

  return <Card error={type === 'error'}>{children}</Card>;
}
