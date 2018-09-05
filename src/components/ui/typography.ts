import styled from 'react-emotion';
import { theme } from '.';

export const CenterText = styled('span')({
  textAlign: 'center',
});

interface AlertTextProps {
  value: number;
}
export const AlertText = styled('span')<AlertTextProps>({}, props => ({
  color: props.value < 0 ? theme.red : undefined,
}));

interface LineThroughProps {
  lineThrough?: boolean;
}

export const LineThrough = styled('div')<LineThroughProps>({}, props => ({
  textDecoration: props.lineThrough ? 'line-through' : 'none',
}));
