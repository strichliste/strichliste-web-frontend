import styled from 'react-emotion';

interface AutoGridProps {
  columns?: string;
  rows?: string;
}

export const AutoGrid = styled('div')<AutoGridProps>(
  {
    margin: '1rem',
    display: 'grid',
    gridGap: '1rem',
    gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
    gridAutoRows: 'minmax(10rem, auto)',
  },
  props => ({
    gridTemplateColumns: props.columns
      ? `repeat(auto-fill, minmax(${props.columns}, 1fr))`
      : undefined,
    gridAutoRows: props.rows ? `minmax(${props.rows}, auto)` : undefined,
  })
);
