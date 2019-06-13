import { Flex, HeaderNavBar, Menu, styled, withTheme } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Logo } from '../ui/icons/logo';
import { SearchInput } from './search';

const HeaderLeft = styled(Flex)({
  a: {
    display: 'inline-flex',
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

const HeaderRight = withTheme(
  styled(Flex)({
    marginRight: '1.5rem',
  })
);

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
          <Menu breakPoint={600} label={<FormattedMessage id="TALLY_HEADER" />}>
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
          </Menu>
        </HeaderLeft>
        <HeaderRight>
          <SearchInput />
        </HeaderRight>
      </Flex>
    </HeaderNavBar>
  );
}
