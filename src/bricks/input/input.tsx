import React from 'react';
import classnames from 'classnames';

import styles from './input.module.css';

type InputProps = React.JSX.IntrinsicElements['input'] & { className?: string };

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

type FormFieldProps = Omit<InputProps, 'children'> & {
  label: React.ReactNode;
  inline?: boolean;
  children?: React.ReactNode | ((id: string) => React.ReactNode);
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  inline = false,
  children,
  ...props
}) => {
  const id = React.useId();
  return (
    <div className={classnames(styles.formField, { [styles.inline]: inline })}>
      <label htmlFor={id}>{label}</label>
      {typeof children === 'function' ? (
        children(id)
      ) : (
        <Input id={id} {...props} />
      )}
    </div>
  );
};
