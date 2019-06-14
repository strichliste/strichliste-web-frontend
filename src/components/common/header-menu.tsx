import { Flex, HeaderNavBar, styled } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Logo } from '../ui/icons/logo';
import { SearchInput } from './search';
import { ScrollContainer } from './scroll-container/scroll-container';

const HeaderLeft = styled(Flex)({
  marginRight: '1.5rem',
  a: {
    marginRight: '1.5rem',
  },
  '.active': {
    padding: 0,
    background: 'transparent!important',
  },
  svg: {
    width: '1rem',
    height: '1rem',
    marginRight: '0.5rem',
  },
});

const HeaderRight = styled(Flex)({
  minWidth: '3rem',
  marginRight: '1.5rem',
});

export function HeaderMenu(): JSX.Element {
  return (
    <HeaderNavBar>
      <Flex
        margin="0 1rem"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <HeaderLeft alignItems="center">
          <Logo />
          <ScrollContainer>
            <NavLink activeClassName="active" to="/user">
              <FormattedMessage id="TALLY_HEADER" />
            </NavLink>
            <NavLink activeClassName="active" to="/articles">
              <FormattedMessage id="ARTICLE_LINK" />
            </NavLink>
            <NavLink activeClassName="active" to="/split-invoice">
              <FormattedMessage
                id="SPLIT_INVOICE_LINK"
                defaultMessage="Split Invoice"
              />
            </NavLink>
            <NavLink activeClassName="active" to="/metrics">
              <FormattedMessage id="METRICS_LINK" defaultMessage="Metrics" />
            </NavLink>
          </ScrollContainer>
        </HeaderLeft>
        <HeaderRight>
          <SearchInput />
        </HeaderRight>
      </Flex>
    </HeaderNavBar>
  );
}
