import { Flex, Menu, Tab, ThemeSwitcher } from 'bricks-of-sand';
import * as React from 'react';
import { NavLink } from 'react-router-dom';

// tslint:disable-next-line:no-any
const Tabs: any = Tab(NavLink);

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
      <ThemeSwitcher height="1rem" />
    </Flex>
  );
}
