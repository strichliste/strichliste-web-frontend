import React from 'react';
import classNames from 'classnames';

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
  // Colour conveys positive/negative; pair with a screen-reader-only word so
  // colour-vision-deficient users get the same signal.
  return (
    <span
      className={classNames(styles.noWrap, {
        [styles.redText]: value < 0,
        [styles.greenText]: value >= 0,
      })}
      {...props}
    >
      <span className={styles.srOnly}>
        {value < 0 ? 'negative balance: ' : 'positive balance: '}
      </span>
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
