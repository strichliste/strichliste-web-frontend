import * as React from 'react';
import styled from 'react-emotion';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Flex, Header } from '../ui';

export interface HeaderMenuProps {}

const HeaderLeft = styled(Flex)({
  a: {
    marginRight: '1.5rem',
  },
});

export function HeaderMenu(props: HeaderMenuProps): JSX.Element {
  return (
    <Header>
      <Flex>
        <HeaderLeft>
          <NavLink activeClassName="active" to="/user">
            <FormattedMessage id="TALLY_HEADER" />
          </NavLink>
          <NavLink activeClassName="active" to="/articles">
            <FormattedMessage id="ARTICLE_LINK" />
          </NavLink>
        </HeaderLeft>
      </Flex>
    </Header>
  );
}
