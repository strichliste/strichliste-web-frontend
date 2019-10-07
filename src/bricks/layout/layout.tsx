import React from 'react';

import styles from './layout.module.css';

export const Center: React.FC = ({ children }) => {
  return <div className={styles.center}>{children}</div>;
};

export interface FlexProps {
  margin?: string;
  padding?: string;
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'stretch';
}

export const Flex: React.FC<FlexProps> = props => {
  return (
    <div
      className={styles.flex}
      style={{
        margin: props.margin,
        padding: props.padding,
        alignContent: props.alignContent,
        alignItems: props.alignItems,
        flexDirection: props.flexDirection,
        flexWrap: props.flexWrap,
        justifyContent: props.justifyContent,
      }}
    >
      {props.children}
    </div>
  );
};
