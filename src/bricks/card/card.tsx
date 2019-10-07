import React from 'react';
import classnames from 'classnames';

import { ShadowKeys } from '../theme';

import styles from './card.module.css';

interface CardProps {
  className?: string;
  height?: string;
  hover?: ShadowKeys;
  width?: string;
  margin?: string;
  padding?: string;
  background?: string;
  color?: string;
  level?: ShadowKeys;
  error?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  color,
  height,
  width,
  margin,
  padding,
  level,
  error,
  style,
}) => {
  return (
    <div
      className={classnames(styles.card, className, {
        [styles.error]: error,
      })}
      style={{
        height,
        width,
        margin,
        padding,
        color,
        boxShadow: level ? `var(--${level})` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
