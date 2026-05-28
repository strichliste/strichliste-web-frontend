import React from 'react';
import classnames from 'classnames';
import { useIntl } from 'react-intl';

import styles from './button.module.css';
import { AcceptIcon, CancelIcon } from '../icons';
import { NavLink, NavLinkProps } from 'react-router-dom';

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

// These icon-only buttons need an accessible name. A consumer-supplied `title`
// (usually an intl message) already provides one, so only fall back to the
// localized default label when neither title nor aria-label is given.
function useIconButtonLabel(
  ariaLabel: string | undefined,
  title: string | undefined,
  id: string,
  fallback: string
): string | undefined {
  const intl = useIntl();
  if (ariaLabel) return ariaLabel;
  if (title) return undefined;
  return intl.formatMessage({ id, defaultMessage: fallback });
}

export const AcceptButton: React.FC<ButtonProps> = ({
  'aria-label': ariaLabel,
  title,
  className,
  ...props
}) => (
  <Button
    {...props}
    title={title}
    aria-label={useIconButtonLabel(ariaLabel, title, 'ACCEPT', 'Accept')}
    className={classnames(styles.acceptButton, className)}
    fab
  >
    <AcceptIcon />
  </Button>
);

export const CancelButton: React.FC<ButtonProps> = ({
  'aria-label': ariaLabel,
  title,
  className,
  ...props
}) => (
  <Button
    {...props}
    title={title}
    aria-label={useIconButtonLabel(ariaLabel, title, 'CANCEL', 'Cancel')}
    className={classnames(styles.cancelButton, className)}
    fab
  >
    <CancelIcon />
  </Button>
);

type TabProps = Omit<NavLinkProps, 'className' | 'style'> & {
  className?: string;
  /** Static styles, merged with the active-state styles applied by Tab itself. */
  style?: React.CSSProperties;
  /** Class name applied when the link is active (defaults to "active"). */
  activeClassName?: string;
};

export const Tab: React.FC<TabProps> = ({
  children,
  className,
  style,
  activeClassName = 'active',
  ...props
}) => {
  return (
    <NavLink
      style={({ isActive }: { isActive: boolean }) => ({
        ...style,
        ...(isActive
          ? {
              background: 'var(--componentBackgroundLight)',
              borderRadius: 'var(--borderRadius)',
            }
          : {}),
      })}
      className={({ isActive }: { isActive: boolean }) =>
        classnames(className, styles.tab, { [activeClassName]: isActive })
      }
      {...props}
    >
      {children}
    </NavLink>
  );
};

