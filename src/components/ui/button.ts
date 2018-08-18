import styled from 'react-emotion';
import { ButtonProps } from './button';

export interface ButtonProps {
  color?: string;
  disabled?: boolean;
  type?: string;
}

export const Button = styled('button')<ButtonProps>(
  {
    margin: '0.5rem',
    padding: '0.5rem',
  },
  props => ({
    background: props.color,
  })
);

Button.defaultProps = {
  color: 'grey',
  type: 'text',
};
