import React from 'react';
import styles from './header-nav.module.css';

export const HeaderNav: React.FC<
  React.PropsWithChildren<{ label?: string }>
> = ({ children, label }) => {
  return (
    <div className={styles.bar}>
      <nav className={styles.nav} aria-label={label}>
        {children}
      </nav>
    </div>
  );
};
