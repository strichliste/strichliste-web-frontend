import React from 'react';
import classnames from 'classnames';

import styles from './button.module.css';
import { AcceptIcon } from '../icons';
import { CancelIcon } from '../../components/ui/icons/add';
import { NavLink } from 'react-router-dom';

type ButtonProps = JSX.IntrinsicElements['button'] & {
  padding?: string;
  margin?: string;
  fab?: boolean;
  primary?: boolean;
  secondary?: boolean;
  text?: boolean;
  green?: boolean;
  red?: boolean;
  highlight?: boolean;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  padding,
  margin,
  fab,
  green,
  red,
  highlight,
  primary,
  ...props
}) => {
  return (
    <button
      {...props}
      className={classnames(styles.button, className, {
        [styles.fab]: fab,
        [styles.green]: green,
        [styles.red]: red,
        [styles.highlight]: highlight,
        [styles.primary]: primary,
      })}
      style={{ padding, margin }}
    >
      {children}
    </button>
  );
};

export const AcceptButton: React.FC<ButtonProps> = props => (
  <Button className={styles.acceptButton} fab {...props}>
    <AcceptIcon />
  </Button>
);

export const CancelButton: React.FC<ButtonProps> = props => (
  <Button className={styles.cancelButton} fab {...props}>
    <CancelIcon />
  </Button>
);

export const Tab: React.FC<any> = ({ children, ...props }) => {
  return <NavLink {...props}>{children}</NavLink>;
};
