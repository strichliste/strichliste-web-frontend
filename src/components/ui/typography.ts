import { Theme, withTheme } from 'bricks-of-sand';
import styled from 'react-emotion';

export const CenterText = styled('span')({
  textAlign: 'center',
});

interface AlertTextProps {
  value: number;
}
export const AlertText = withTheme<AlertTextProps, Theme>(
  styled('span')<AlertTextProps>({}, props => {
    return {
      color: props.value < 0 ? props.theme.red : props.theme.green,
    };
  })
);

interface LineThroughProps {
  lineThrough?: boolean;
}

export const LineThrough = styled('div')<LineThroughProps>({}, props => ({
  textDecoration: props.lineThrough ? 'line-through' : 'none',
}));
