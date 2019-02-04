import {
  AlertText,
  Ellipsis,
  Menu,
  Tab,
  styled,
  withTheme,
} from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { User } from '../../store/reducers';
import { Currency } from '../currency';
import { ProductIcon } from '../ui/icons/product';
import { ShoppingBagIcon } from '../ui/icons/shopping-bag';
import { TransactionIcon } from '../ui/icons/transactions';
import { UserDetailRouter } from './user-details-router';

// tslint:disable-next-line:no-any
const LinkTab: any = styled(Tab(NavLink))({
  svg: {
    marginRight: '0.5rem',
  },
});

const UserHeader = withTheme(
  styled('div')(
    {
      margin: '0 auto',
      maxWidth: '100%',

      h1: {
        textTransform: 'none',
        fontSize: '2rem',
        textAlign: 'center',
        margin: '1rem auto',
      },
    },
    props => ({
      padding: '0 1rem',
      [props.theme.breakPoints.tablet]: {
        width: '29rem',
      },
      h1: {
        color: props.theme.primary,
        maxWidth: '400px',
      },
    })
  )
);

const toggleTab = (
  url: string,
  currentUrl: string,
  userUrl: string
): string => {
  return url === currentUrl ? userUrl : url;
};

export interface UserDetailsHeaderProps extends RouteComponentProps {
  user: User;
}

const component = ({ user, location }: UserDetailsHeaderProps) => {
  const currentUrl = location.pathname;
  const userUrl = `/user/${user.id}`;
  return (
    <UserHeader>
      <h1>
        <Ellipsis>{user.name}</Ellipsis>
      </h1>
      <h1>
        <AlertText value={user.balance}>
          <Currency value={user.balance} />
        </AlertText>
      </h1>

      <Menu justifyMenu="space-between" label="USER ACTIONS" breakPoint={600}>
        <LinkTab
          activeClassName="active"
          to={toggleTab(
            `/user/${user.id}/send_money_to_a_friend`,
            currentUrl,
            userUrl
          )}
        >
          <TransactionIcon />{' '}
          <FormattedMessage id="USER_TRANSACTION_CREATE_LINK" />
        </LinkTab>
        <LinkTab
          activeClassName="active"
          to={toggleTab(`/user/${user.id}/article`, currentUrl, userUrl)}
        >
          <ShoppingBagIcon /> <FormattedMessage id="USER_ARTICLE_LINK" />
        </LinkTab>
        <LinkTab
          activeClassName="active"
          to={toggleTab(`/user/${user.id}/edit`, currentUrl, userUrl)}
        >
          <ProductIcon /> <FormattedMessage id="USER_EDIT_LINK" />
        </LinkTab>
      </Menu>
      <UserDetailRouter />
    </UserHeader>
  );
};

export const UserDetailsHeader = withRouter(component);
