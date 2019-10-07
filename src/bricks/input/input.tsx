import React from 'react';
import classnames from 'classnames';

import styles from './input.module.css';

type InputProps = JSX.IntrinsicElements['input'];

export const Input: React.FC<InputProps> = (className, ...props) => {
  return <input {...props} className={classnames(className, styles.input)} />;
};
