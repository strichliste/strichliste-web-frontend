import styled from 'react-emotion';
import { shadows } from '.';

export const MaterialInput = styled('div')({
  input: {
    boxShadow: shadows.level5,
    padding: '0.8rem 0.5rem',
    border: 'none',
  },
});
