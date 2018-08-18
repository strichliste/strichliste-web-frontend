import styled from 'react-emotion';

export const AutoGrid = styled('div')({
  margin: '1rem',
  display: 'grid',
  gridGap: '1rem',
  gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
  gridAutoRows: 'minmax(10rem, auto)',
});
