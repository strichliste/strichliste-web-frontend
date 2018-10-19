import { Block, withTheme } from 'bricks-of-sand';
import styled from 'react-emotion';

export const Tabs = withTheme(
  styled(Block)(
    {
      fontSize: '0.8rem',
    },
    props => ({
      textTransform: 'uppercase',
      a: {
        color: props.theme.textSubtile,
        marginRight: '1.5rem',
        display: 'inline-flex',
        padding: '0.5rem',
        borderRadius: props.theme.borderRadius,
      },
      'a.active': {
        background: props.theme.white,
        color: props.theme.black,
      },
    })
  )
);
