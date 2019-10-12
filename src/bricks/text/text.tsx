import React from 'react';
import classNames from 'classnames';

import styles from './text.module.css';

export const Ellipsis: React.FunctionComponent<{ title?: string }> = ({
  children,
  title,
}) => {
  const fallbackTitle = typeof children === 'string' ? children : '';
  return (
    <div className={styles.ellipsis} title={title || fallbackTitle}>
      {children}
    </div>
  );
};

interface AlertTextProps {
  value: number;
  style?: React.CSSProperties;
}
export const AlertText: React.FC<AlertTextProps> = ({ value, ...props }) => {
  return (
    <span
      className={classNames(styles.noWrap, {
        [styles.redText]: value < 0,
        [styles.greenText]: value >= 0,
      })}
      {...props}
    />
  );
};

interface LineThroughProps {
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
