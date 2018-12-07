import { Menu, Tab, withTheme } from 'bricks-of-sand';
import * as React from 'react';
import styled from 'react-emotion';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { User } from '../../store/reducers';
import { Currency } from '../currency';
import { AlertText } from '../ui';
import { ProductIcon } from '../ui/icons/product';
import { ShoppingBagIcon } from '../ui/icons/shopping-bag';
import { TransactionIcon } from '../ui/icons/transactions';
import { UserDetailRouter } from './user-details-router';

const LinkTab = styled(Tab(NavLink))({
  svg: {
    marginRight: '0.5rem',
  },
});

const UserHeader = withTheme(
  styled('div')(
    {
      margin: '0 auto',
      h1: {
        textTransform: 'none',
        fontSize: '2rem',
        textAlign: 'center',
        margin: '1rem 0',
      },
    },
    props => ({
      padding: '0 1rem',
      [props.theme.breakPoints.tablet]: {
        width: '29rem',
      },
      h1: {
        color: props.theme.primary,
      },
    })
  )
);

export interface UserDetailsHeaderProps {
  user: User;
}

export function UserDetailsHeader({
  user,
}: UserDetailsHeaderProps): JSX.Element {
  return (
    <UserHeader>
      <NavLink to={`/user/${user.id}/`}>
        <h1>{user.name}</h1>
      </NavLink>
      <h1>
        <AlertText value={user.balance}>
          <Currency value={user.balance} />
        </AlertText>
      </h1>

      <Menu justifyMenu="space-between" label="USER ACTIONS" breakPoint={600}>
        <LinkTab
          activeClassName="active"
          to={`/user/${user.id}/send_money_to_a_friend`}
        >
          <TransactionIcon />{' '}
          <FormattedMessage id="USER_TRANSACTION_CREATE_LINK" />
        </LinkTab>
        <LinkTab activeClassName="active" to={`/user/${user.id}/article`}>
          <ShoppingBagIcon /> <FormattedMessage id="USER_ARTICLE_LINK" />
        </LinkTab>
        <LinkTab activeClassName="active" to={`/user/${user.id}/edit`}>
          <ProductIcon /> <FormattedMessage id="USER_EDIT_LINK" />
        </LinkTab>
      </Menu>
      <UserDetailRouter />
    </UserHeader>
  );
}
