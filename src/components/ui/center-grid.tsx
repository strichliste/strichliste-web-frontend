import * as React from 'react';
import styled from 'react-emotion';

export const GridContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridGap: '1rem',
  gridAutoRows: '200px',
  gridTemplateAreas: `". a a ."
    ". a a ."`,
});

const Content = styled('div')({
  gridArea: 'a',
  alignSelf: 'center',
  justifySelf: 'center',
});

export function CenterGrid(props: { children?: React.ReactNode }): JSX.Element {
  return (
    <GridContainer>
      <Content>{props.children}</Content>
    </GridContainer>
  );
}
