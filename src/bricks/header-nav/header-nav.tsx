import React from 'react';
import styles from './header-nav.module.css';

export const HeaderNav: React.FC = ({ children }) => {
  return (
    <div className={styles.bar}>
      <nav className={styles.nav}>{children}</nav>
    </div>
  );
};
