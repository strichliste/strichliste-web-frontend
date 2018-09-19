import styled from 'react-emotion';
import { Flex } from './layout';
import { shadows } from './theme';

interface CardProps {
  height?: string;
  hover?: boolean;
  width?: string;
  margin?: string;
  background?: string;
  color?: string;
  flex?: boolean;
}

export const Card = styled(Flex)<CardProps>(
  {
    fontSize: '1rem',
    overflow: 'hidden',
    padding: '1rem',
    position: 'relative',
    borderRadius: '4px',
    background: '#fff',
    boxShadow: shadows.level2,
    transition: 'all 0.3s cubic-bezier(.25, .8, .25, 1)',
  },
  props => ({
    display: props.flex ? 'flex' : 'block',
    width: props.width,
    margin: props.margin,
    height: props.height,
    background: props.background,
    color: props.color,
    '&:hover': {
      boxShadow: props.hover ? shadows.level5 : shadows.level2,
    },
  })
);

export const CardContainer = styled('div')({
  width: '100%',
  height: '100%',
  textAlign: 'center',
});

export const CardContent = styled('div')({
  width: '100%',
});
