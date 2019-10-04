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
}) => {
  return (
    <div
      className={classnames(styles.card, className)}
      style={{
        height,
        width,
        margin,
        padding,
        color,
        boxShadow: level ? `var(--${level})` : undefined,
      }}
    >
      {children}
    </div>
  );
};
