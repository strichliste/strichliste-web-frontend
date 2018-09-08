import styled from 'react-emotion';
import { theme } from './theme';

export const FormField = styled('div')({
  marginBottom: '0.5rem',
});

export interface FixedContainerProps {
  top?: number;
}
export const FixedContainer = styled('div')<FixedContainerProps>(
  {
    position: 'fixed',
    width: '100%',
  },
  props => ({
    top: props.top,
  })
);

export const Section = styled('section')({
  padding: '1rem',
});

interface RowProps {
  alignContent?: string;
  justifyContent?: string;
}
export const Row = styled('div')<RowProps>(
  {
    display: 'flex',
    width: '100%',
  },
  props => ({
    alignContent: props.alignContent,
    justifyContent: props.justifyContent,
  })
);

export const CenterSection = styled(Section)({
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  padding: '0',
});

interface ColumnProps {
  margin?: string;
  width?: string;
  grow?: number;
}
export const Column = styled('div')<ColumnProps>(
  {
    flexGrow: 1,
  },
  props => ({
    flexGrow: props.grow,
    margin: props.margin,
    width: props.width,
  })
);

export const FullWidth = styled('div')({
  width: '100%',
});

export const ListItem = styled('div')({
  borderBottom: `solid 1px ${theme.border}`,
  padding: '1rem 0',
});

export const SplitLayout = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  margin: '1rem',
  gridGap: '1rem',
  '@media (min-width: 48rem)': {
    gridTemplateColumns: '1fr 1fr',
  },
});
