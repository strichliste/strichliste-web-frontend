import styled from 'react-emotion';
import { theme } from './theme';

export const FormField = styled('div')({
  marginBottom: '0.5rem',
});

export const Section = styled('section')({
  padding: '1.5rem',
});

export const Row = styled('div')({
  display: 'flex',
  width: '100%',
});

export const CenterSection = styled(Section)({
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
});

interface ColumnProps {
  margin?: string;
}
export const Column = styled('div')<ColumnProps>(
  {
    flexGrow: 1,
  },
  props => ({
    margin: props.margin,
  })
);

export const FullWidth = styled('div')({
  width: '100%',
});

export const ListItem = styled('div')({
  borderBottom: `solid 1px ${theme.border}`,
  padding: '1rem',
});
