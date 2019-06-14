import { Flex, Tab, ThemeSwitcher, styled } from 'bricks-of-sand';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { ScalingButtons } from '../settings/scaling-buttons';
import { ScrollContainer } from './scroll-container/scroll-container';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Tabs: any = Tab(NavLink);

const IconNav = styled('div')({
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  button: {
    marginRight: '1rem',
  },
});

export interface NavTabMenusProps {
  breakpoint: number;
  label: React.ReactNode;
  tabs: { message: JSX.Element; to: string }[];
  margin?: string;
}

export function NavTabMenus({ tabs, margin }: NavTabMenusProps): JSX.Element {
  return (
    <Flex justifyContent="space-between" margin={margin}>
      <ScrollContainer style={{ margin: '0 2rem 0 0' }}>
        {tabs.map(tab => (
          <Tabs
            margin="0 1.5rem 0 0"
            key={tab.to}
            activeClassName="active"
            to={tab.to}
          >
            {tab.message}
          </Tabs>
        ))}
      </ScrollContainer>
      <IconNav>
        <ThemeSwitcher height="1rem" />
        <ScalingButtons />
      </IconNav>
    </Flex>
  );
}
