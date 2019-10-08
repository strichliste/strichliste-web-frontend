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

export const Separator: React.FC<{ margin?: string; padding?: string }> = ({
  padding,
  margin,
}) => {
  return (
    <div
      style={{ margin, padding, borderTop: 'solid 1px var(--border)' }}
    ></div>
  );
};

export const GridOneOneTwo: React.FC = ({ children }) => {
  return <div className={styles.gridOneOneTwo}>{children}</div>;
};

export const Grid_3: React.FC = ({ children }) => {
  return <div className={styles.grid3}>{children}</div>;
};

export const CardGrid: React.FC = ({ children }) => {
  return <div className={styles.cardGrid}>{children}</div>;
};
