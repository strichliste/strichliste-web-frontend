import styled from 'react-emotion';
import { theme } from '.';

export const FixedFooter = styled('footer')({
  position: 'fixed',
  width: '100%',
  background: theme.primary,
  bottom: 0,
});
