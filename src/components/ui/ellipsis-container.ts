import styled from 'react-emotion';

export const Ellipsis = styled('p')({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
});
