import React from 'react';

import styles from './button.module.css';

type ButtonProps = JSX.IntrinsicElements['button'];

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button {...props} className={styles.button}>
      {children}
    </button>
  );
};
