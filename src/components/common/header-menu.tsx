import {
  Flex,
  HeaderNavBar,
  Icon,
  SearchInput,
  withTheme,
} from 'bricks-of-sand';
import * as React from 'react';
import styled from 'react-emotion';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { SearchIcon } from '../ui/icons/search';

// tslint:disable no-var-requires no-require-imports
const Logo = require('../ui/icons/strichlisteLogo.svg');

export interface HeaderMenuProps {}

const HeaderLeft = styled(Flex)({
  a: {
    alignItems: 'center',
    display: 'inline-flex',
    marginLeft: '1.5rem',
  },
});

const HeaderRight = withTheme(
  styled(Flex)(
    {
      marginRight: '1.5rem',
    },
    props => ({
      svg: {
        marginTop: '0.6rem',
        height: '1rem',
        fill: props.theme.textSubtile,
        display: 'inline-flex',
      },
    })
  )
);

export function HeaderMenu(props: HeaderMenuProps): JSX.Element {
  return (
    <HeaderNavBar>
      <Flex width="100%" justifyContent="space-between">
        <HeaderLeft>
          <NavLink activeClassName="active" to="/user">
            <Icon width="1rem" height="1rem" margin="0 0.5rem 0 0" src={Logo} />
            <FormattedMessage id="TALLY_HEADER" />
          </NavLink>
          <NavLink activeClassName="active" to="/articles">
            <FormattedMessage id="ARTICLE_LINK" />
          </NavLink>
        </HeaderLeft>
        <HeaderRight>
          <SearchInput>
            <Flex>
              <input placeholder="search" type="text" />
              <SearchIcon />
            </Flex>
          </SearchInput>
        </HeaderRight>
      </Flex>
    </HeaderNavBar>
  );
}
