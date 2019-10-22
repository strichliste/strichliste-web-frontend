import React from 'react';

import styles from './scroll-container.module.css';

export const ScrollContainer: React.FC<{ style?: React.CSSProperties }> = ({
  children,
  style,
}) => {
  return (
    <div style={style} className={styles.container}>
      {children}
    </div>
  );
};
