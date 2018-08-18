import styled from 'react-emotion';
import { ButtonProps } from './button';

export interface ButtonProps {
  color?: string;
  disabled?: boolean;
  type?: string;
  margin?: string;
}

export const Button = styled('button')<ButtonProps>(
  {
    border: 'none',
    borderRadius: '2px',
    padding: ' 0.5rem',
    cursor: 'pointer',
    color: 'white',
    backgroundColor: '#2196f3',
    boxShadow: '0 0 4px #999',
    outline: 'none',
    backgroundPosition: 'center',
    transition: 'background 0.8s',
    '&:hover': {
      background:
        '#47a7f5 radial - gradient(circle, transparent 1 %, #47a7f5 1 %) center / 15000 %',
    },
    '&:active': {
      backgroundColor: '#fff',
      backgroundSize: '100%',
      transition: 'background 0s',
    },
  },
  props => ({
    background: props.color,
  })
);

Button.defaultProps = {
  color: 'grey',
  type: 'text',
};
