import styled from 'react-emotion';
import { WithMargin, theme } from '.';

export const Tabs = styled(WithMargin)({
  fontSize: '0.8rem',
  color: `${theme.grey}`,
  borderBottom: `solid 1px ${theme.black}`,
  textTransform: 'uppercase',
  a: {
    color: `${theme.grey}`,
    marginRight: '1.5rem',
    display: 'inline-flex',
    paddingBottom: '0.5rem',
  },
  '.active': {
    color: `${theme.black}`,
    borderBottom: `solid 2px ${theme.black}`,
  },
});
