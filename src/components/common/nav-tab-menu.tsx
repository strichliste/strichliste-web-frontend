import { Flex, Menu, Tab, ThemeSwitcher, styled } from 'bricks-of-sand';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { ScalingButtons } from '../settings/scaling-buttons';

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

export function NavTabMenus({
  breakpoint,
  label,
  tabs,
  margin,
}: NavTabMenusProps): JSX.Element {
  return (
    <Flex justifyContent="space-between" margin={margin}>
      <Menu inlineMargin="0 2rem 0 0" breakPoint={breakpoint} label={label}>
        {tabs.map(tab => (
          <Tabs key={tab.to} activeClassName="active" to={tab.to}>
            {tab.message}
          </Tabs>
        ))}
      </Menu>
      <IconNav>
        <ThemeSwitcher height="1rem" />
        <ScalingButtons />
      </IconNav>
    </Flex>
  );
}
