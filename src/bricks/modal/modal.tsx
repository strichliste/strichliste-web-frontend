import React from 'react';
import ReactDom from 'react-dom';

import styles from './modal.module.css';

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

export const useModal = () => {};

export const Modal: React.FC<{
  backDropTile: string;
  onOutSideClick(): void;
}> = ({ children, backDropTile, onOutSideClick }) => {
  return ReactDom.createPortal(
    <>
      <div>{children}</div>
      <Backdrop onClick={onOutSideClick} title={backDropTile} />
    </>,
    document.body
  );
};
