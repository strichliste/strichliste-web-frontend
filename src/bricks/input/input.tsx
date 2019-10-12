import React from 'react';
import classnames from 'classnames';

import styles from './input.module.css';

type InputProps = JSX.IntrinsicElements['input'] & { className?: string };

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        className={classnames(className, styles.input)}
      />
    );
  }
);
