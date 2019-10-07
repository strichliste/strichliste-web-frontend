import React from 'react';
import classnames from 'classnames';

import styles from './button.module.css';
import { AcceptIcon } from '../icons';
import { CancelIcon } from '../../components/ui/icons/add';

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
  children,
  padding,
  margin,
  fab,
  ...props
}) => {
  return (
    <button
      {...props}
      className={classnames(styles.button, {
        [styles.fab]: fab,
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

type TagProps = JSX.IntrinsicElements['a'];

export const Tag: React.FC<TagProps> = ({ children, ...props }) => {
  return <a {...props}>{children}</a>;
};
