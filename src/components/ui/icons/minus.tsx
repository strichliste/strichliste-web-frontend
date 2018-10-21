import * as React from 'react';

export interface MinusIconProps {}

export function MinusIcon(props: MinusIconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="2"
      viewBox="0 0 16 2"
    >
      <polygon points="16 0 16 2 0 2 0 0" />
    </svg>
  );
}
