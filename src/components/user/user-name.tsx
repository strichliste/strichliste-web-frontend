import { Ellipsis, styled } from 'bricks-of-sand';
import * as React from 'react';

const Wrapper = styled('div')<{ width?: string; center?: boolean }>(
  {
    maxWidth: '100%',
    display: 'inline-flex',
  },
  props => ({
    width: props.width || '320px',
    alignContent: props.center ? 'center' : '',
    justifyContent: props.center ? 'center' : '',
  })
);

export interface UserNameProps {
  name: string;
  width?: string;
  center?: boolean;
}

export function UserName(props: UserNameProps): JSX.Element {
  return (
    <Wrapper center={props.center} width={props.width}>
      <Ellipsis>{props.name}</Ellipsis>
    </Wrapper>
  );
}
