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

Input.displayName = 'Input';

export const FormField: React.FC<any> = ({ label, children, ...props }) => {
  const id = React.useRef(Date.now() + 'di');
  return (
    <div className={styles.formField}>
      <label htmlFor={id.current}>{label}</label>
      {typeof children === 'function' ? (
        children(id.current)
      ) : (
        <Input id={id.current} {...props} />
      )}
    </div>
  );
};
