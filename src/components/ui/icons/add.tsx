import { styled, withTheme } from 'bricks-of-sand';
import * as React from 'react';

export interface AddIconProps {
  isPrimary?: boolean;
}

function Icon(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <polygon points="9 7 16 7 16 9 9 9 9 16 7 16 7 9 0 9 0 7 7 7 7 0 9 0" />
    </svg>
  );
}

export const AddIcon = withTheme(
  styled(Icon)<AddIconProps>({}, props => ({
    fill: props.isPrimary ? props.theme.primary : props.theme.white,
  }))
);
export const CancelIcon = styled(Icon)<AddIconProps>({
  transform: 'rotate(45deg)',
});
