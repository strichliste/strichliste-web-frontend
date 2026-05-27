import React from 'react';
import ReactDom from 'react-dom';

import styles from './modal.module.css';
import { Card } from '..';

export const Backdrop: React.FC<{ title: string; onClick(): void }> = ({
  onClick,
  title,
}) => {
  return ReactDom.createPortal(
    <button
      className={styles.backdrop}
      onClick={onClick}
      title={title}
    ></button>,
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
  const handleEsc = (e: any) => {
    if (e.keyCode === 27) {
      handleHide();
    }
  };
  const handlePopState = () => handleHide(false);

  React.useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleEsc);
      window.addEventListener('popstate', handlePopState);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      window.removeEventListener('popstate', handlePopState);
    };
    // eslint-disable-next-line
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
  backDropTile?: string;
  label?: string;
  id?: string;
}> = ({
  id,
  children,
  show,
  handleHide,
  backDropTile = 'close',
  label = 'Dialog',
}) => {
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
      previouslyFocused.current?.focus?.();
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
        aria-label={label}
        tabIndex={-1}
      >
        <Card id={id} className={styles.modal}>
          {children}
        </Card>
      </div>
      <Backdrop onClick={handleHide} title={backDropTile} />
    </>,
    document.body
  );
};
