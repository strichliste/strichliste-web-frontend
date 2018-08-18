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
