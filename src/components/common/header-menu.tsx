import { Flex, HeaderNavBar, Icon, Menu, withTheme } from 'bricks-of-sand';
import * as React from 'react';
import styled from 'react-emotion';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { ConnectedSearchInput } from './search';

// tslint:disable no-var-requires no-require-imports
const Logo = require('../ui/icons/strichlisteLogo.svg');

export interface HeaderMenuProps {}

const HeaderLeft = styled(Flex)({
  a: {
    display: 'inline-flex',
    marginRight: '1.5rem',
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
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <HeaderLeft>
          <Icon width="1rem" margin="0 0.5rem 0 1rem" src={Logo} />
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
