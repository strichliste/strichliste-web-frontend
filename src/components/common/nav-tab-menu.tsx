import * as React from 'react';
import { Flex, Tab, ThemeSwitcher, ScrollContainer } from '../../bricks';
import { ScalingButtons } from '../settings/scaling-buttons';

export interface NavTabMenusProps {
  breakpoint: number;
  label: React.ReactNode;
  tabs: { message: React.JSX.Element; to: string }[];
  margin?: string;
}

export function NavTabMenus({ tabs, margin }: NavTabMenusProps): React.JSX.Element {
  return (
    <Flex grow="1" justifyContent="space-between" margin={margin}>
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
