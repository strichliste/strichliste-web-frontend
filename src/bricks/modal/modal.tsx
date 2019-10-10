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
  }, [show]);

  return { show, handleHide, handleShow };
};

export const Modal: React.FC<{
  handleShow(): void;
  handleHide(popState?: boolean): void;
  show: boolean;
  backDropTile?: string;
}> = ({ children, show, handleHide, backDropTile = 'close' }) => {
  if (!show) {
    return null;
  }

  return ReactDom.createPortal(
    <>
      <Card className={styles.modal}>{children}</Card>
      <Backdrop onClick={handleHide} title={backDropTile} />
    </>,
    document.body
  );
};
