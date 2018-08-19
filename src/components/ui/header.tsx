import styled from 'react-emotion';
import { theme } from './theme';

export const Header = styled('header')({
  padding: '1rem',
  textAlign: 'center',
  background: `${theme.primary}`,
  color: `${theme.white}`,
  boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  a: {
    color: `${theme.white}`,
  },
});
