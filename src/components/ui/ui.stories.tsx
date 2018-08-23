import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { Card, CardContainer } from '.';
import { AutoGrid } from './auto-grid';
import { CenterGrid } from './center-grid';

// tslint:disable-next-line:no-any
storiesOf('Components/UI', module).add('Cards', () => (
  <CardContainer>
    <Card>this is a card</Card>
    <Card>this is aother card</Card>
    <Card>this is card has awseom context</Card>
    <Card>
      <div>
        <p>Jupiter Jones</p>
        <p>12,30$</p>
      </div>
    </Card>
    <Card>
      <div>
        <p>Peter Shaw</p>
        <p>0,30$</p>
      </div>
    </Card>
    <Card>
      <div>
        <p>Bob Andrews</p>
        <p>1055,34$</p>
      </div>
    </Card>
  </CardContainer>
));

storiesOf('Components/UI', module).add('Cards Autogrid', () => (
  <AutoGrid>
    <Card>this is a card</Card>
    <Card>this is aother card</Card>
    <Card>this is card has awseom context</Card>
    <Card>
      <div>
        <p>Jupiter Jones</p>
        <p>12,30$</p>
      </div>
    </Card>
    <Card>
      <div>
        <p>Peter Shaw</p>
        <p>0,30$</p>
      </div>
    </Card>
    <Card>
      <div>
        <p>Bob Andrews</p>
        <p>1055,34$</p>
      </div>
    </Card>
  </AutoGrid>
));

storiesOf('Components/UI', module).add('Cards CenterGRid', () => (
  <CenterGrid>
    <Card>
      <div>
        <p>Jupiter Jones</p>
        <p>12,30$</p>
      </div>
    </Card>
  </CenterGrid>
));

storiesOf('Components/UI', module).add('Card', () => <Card />);
