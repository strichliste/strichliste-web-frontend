import * as React from 'react';
import { ScrollContainer } from './scroll-container/scroll-container';
import { Flex, Tab, ThemeSwitcher } from '../../bricks';
import { ScalingButtons } from '../settings/scaling-buttons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

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
          <Tab style={{ margin: '0 1.5rem 0 0' }} key={tab.to} to={tab.to}>
            {tab.message}
          </Tab>
        ))}
      </ScrollContainer>
      <Flex>
        <ScalingButtons />
        <ThemeSwitcher />
      </Flex>
    </Flex>
  );
}
