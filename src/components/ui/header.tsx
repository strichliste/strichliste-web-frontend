import { theme } from 'bricks-of-sand';
import styled from 'react-emotion';

export const Header = styled('header')({
  fontSize: '1.2rem',
  padding: '1rem',
  marginBottom: '3rem',
  textAlign: 'center',
  color: `${theme.grey}`,
  textTransform: 'uppercase',
  a: {
    color: `${theme.grey}`,
  },
  '.active': {
    color: `${theme.primary}`,
  },
});
