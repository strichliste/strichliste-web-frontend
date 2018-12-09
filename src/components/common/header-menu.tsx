import { Block, Flex, HeaderNavBar, Menu, withTheme } from 'bricks-of-sand';
import * as React from 'react';
import styled from 'react-emotion';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Logo } from '../ui/icons/logo';
import { ConnectedSearchInput } from './search';

export interface HeaderMenuProps {}

const HeaderLeft = styled(Flex)({
  a: {
    display: 'inline-flex',
    marginRight: '1.5rem',
  },
  '.active': {
    padding: 0,
  },
});

const HeaderRight = withTheme(
  styled(Flex)({
    marginRight: '1.5rem',
  })
);

export function HeaderMenu(props: HeaderMenuProps): JSX.Element {
  return (
    <HeaderNavBar>
      <Flex
        margin="0 1rem"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <HeaderLeft>
          <Block margin="0 0.5rem 0 0">
            <Logo width="1rem" />
          </Block>
          <Menu breakPoint={500} label={<FormattedMessage id="TALLY_HEADER" />}>
            <NavLink activeClassName="active" to="/user">
              <FormattedMessage id="TALLY_HEADER" />
            </NavLink>
            <NavLink activeClassName="active" to="/articles">
              <FormattedMessage id="ARTICLE_LINK" />
            </NavLink>
          </Menu>
        </HeaderLeft>
        <HeaderRight>
          <ConnectedSearchInput />
        </HeaderRight>
      </Flex>
    </HeaderNavBar>
  );
}
