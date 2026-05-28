import React from 'react';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import styles from './text.module.css';

export const Ellipsis: React.FunctionComponent<{
  children?: React.ReactNode;
  title?: string;
}> = ({ children, title }) => {
  const fallbackTitle = typeof children === 'string' ? children : '';
  return (
    <div className={styles.ellipsis} title={title || fallbackTitle}>
      {children}
    </div>
  );
};

interface AlertTextProps {
  children?: React.ReactNode;
  value: number;
  style?: React.CSSProperties;
}
export const AlertText: React.FC<AlertTextProps> = ({
  value,
  children,
  ...props
}) => {
  const intl = useIntl();
  // Colour conveys positive/negative; pair with a screen-reader-only word so
  // colour-vision-deficient users get the same signal. The cue is three-way
  // (zero gets its own label) so a balance of 0 doesn't lie as "positive".
  const sign = value > 0 ? 'positive' : value < 0 ? 'negative' : 'zero';
  const srLabel = intl.formatMessage({
    id:
      sign === 'positive'
        ? 'BALANCE_SIGN_POSITIVE'
        : sign === 'negative'
          ? 'BALANCE_SIGN_NEGATIVE'
          : 'BALANCE_SIGN_ZERO',
  });
  return (
    <span
      className={classNames(styles.noWrap, {
        [styles.redText]: value < 0,
        [styles.greenText]: value > 0,
      })}
      {...props}
    >
      <span className={styles.srOnly}>{srLabel}</span>
      {children}
    </span>
  );
};

interface LineThroughProps {
  children?: React.ReactNode;
  lineThrough?: boolean;
  className?: string;
}

export const LineThrough: React.FC<LineThroughProps> = ({
  lineThrough,
  className,
  ...props
}) => (
  <div
    className={classNames(className, { [styles.lineThrough]: lineThrough })}
    {...props}
  />
);
