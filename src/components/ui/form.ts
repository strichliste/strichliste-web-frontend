import styled from 'react-emotion';
import { shadows } from '.';

export const MaterialInput = styled('div')({
  background: 'white',
  margin: '3rem',
  input: {
    boxShadow: shadows.level5,
    padding: '0.8rem 0.5rem',
    border: 'none',
  },
});
