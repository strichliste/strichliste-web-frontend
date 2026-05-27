import React from 'react';
import classnames from 'classnames';

import styles from './button.module.css';
import { AcceptIcon, CancelIcon } from '../icons';
import { NavLink } from 'react-router-dom';

type ButtonProps = React.JSX.IntrinsicElements['button'] & {
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
  ref?: any;
};

// eslint-disable-next-line react/display-name
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      padding,
      margin,
      fab,
      green,
      red,
      highlight,
      primary,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        className={classnames(styles.button, className, {
          [styles.fab]: fab,
          [styles.green]: green,
          [styles.red]: red,
          [styles.highlight]: highlight,
          [styles.primary]: primary,
        })}
        style={{ padding, margin, ...style }}
      >
        {children}
      </button>
    );
  }
);

export const AcceptButton: React.FC<ButtonProps> = props => (
  <Button aria-label="Accept" className={styles.acceptButton} fab {...props}>
    <AcceptIcon />
  </Button>
);

export const CancelButton: React.FC<ButtonProps> = props => (
  <Button aria-label="Cancel" className={styles.cancelButton} fab {...props}>
    <CancelIcon />
  </Button>
);

export const Tab: React.FC<any> = ({
  children,
  className,
  active,
  activeClassName = 'active',
  ...props
}) => {
  return (
    <NavLink
      style={({ isActive }: { isActive: boolean }) =>
        isActive
          ? {
              background: 'var(--componentBackgroundLight)',
              borderRadius: 'var(--borderRadius)',
            }
          : {}
      }
      className={({ isActive }: { isActive: boolean }) =>
        classnames(className, styles.tab, { [activeClassName]: isActive })
      }
      {...props}
    >
      {children}
    </NavLink>
  );
};

export const Tag: React.FC<
  React.PropsWithChildren<{ red?: boolean; green?: boolean }>
> = ({ red, green, children }) => {
  return (
    <div
      className={classnames(styles.tags, {
        [styles.red]: red,
        [styles.green]: green,
      })}
    >
      <button>
        <CancelIcon />
      </button>
      <button>{children}</button>
    </div>
  );
};
