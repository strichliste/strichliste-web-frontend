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

  React.useEffect(() => {
    const id = setTimeout(() => {
      setVisible(false);
      onFadeOut?.();
    }, fadeOutSeconds * 1000);
    return () => clearTimeout(id);
  }, [fadeOutSeconds, onFadeOut]);

  if (!isVisible) {
    return null;
  }

  return <Card error={type === 'error'}>{children}</Card>;
}
