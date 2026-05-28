import React from 'react';
import ReactDom from 'react-dom';
import { useIntl } from 'react-intl';

import styles from './modal.module.css';
import { Card } from '..';

/**
 * Backdrop is intentionally `role="presentation"`: it dismisses the dialog
 * when clicked, but isn't an interactive control to keyboard/AT users — they
 * use Escape, the close button inside the dialog, or the focus-trap exit.
 */
const Backdrop: React.FC<{ onClick(): void }> = ({ onClick }) => {
  return ReactDom.createPortal(
    <div role="presentation" className={styles.backdrop} onClick={onClick} />,
    document.body
  );
};

export const useModal = (initialShow = false) => {
  const [show, setShow] = React.useState(initialShow);

  const handleShow = () => {
    window.history.pushState(null, document.title, window.location.href);
    setShow(true);
  };
  const handleHide = (popState = true) => {
    if (popState) {
      window.history.back();
    }
    setShow(false);
  };

  React.useEffect(() => {
    if (!show) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleHide();
      }
    };
    const handlePopState = () => handleHide(false);
    document.addEventListener('keydown', handleEsc);
    window.addEventListener('popstate', handlePopState);
    return () => {
      document.removeEventListener('keydown', handleEsc);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [show]);

  return { show, handleHide, handleShow };
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export const Modal: React.FC<{
  children?: React.ReactNode;
  handleShow(): void;
  handleHide(popState?: boolean): void;
  show: boolean;
  /** Accessible name of the dialog. Defaults to a localized "Dialog". */
  label?: string;
  id?: string;
}> = ({ id, children, show, handleHide, label }) => {
  const intl = useIntl();
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!show) {
      return;
    }
    // Remember what had focus, move focus into the dialog, restore on close.
    previouslyFocused.current = document.activeElement as HTMLElement;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE);
    (focusable && focusable.length ? focusable[0] : dialog)?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !dialog) {
        return;
      }
      const items = dialog.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', trap);
    return () => {
      document.removeEventListener('keydown', trap);
      // Restore focus to whatever had it before; fall back to the main landmark
      // if the original element was unmounted while the dialog was open.
      const previous = previouslyFocused.current;
      if (previous && document.body.contains(previous)) {
        previous.focus();
      } else {
        document.getElementById('main-content')?.focus();
      }
    };
  }, [show]);

  if (!show) {
    return null;
  }

  return ReactDom.createPortal(
    <>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={
          label ?? intl.formatMessage({ id: 'DIALOG', defaultMessage: 'Dialog' })
        }
        tabIndex={-1}
      >
        <Card id={id} className={styles.modal}>
          {children}
        </Card>
      </div>
      <Backdrop onClick={() => handleHide()} />
    </>,
    document.body
  );
};
