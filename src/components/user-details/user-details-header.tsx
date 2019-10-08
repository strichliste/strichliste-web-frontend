import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useSettings } from '../../store';
import { User } from '../../store/reducers';
import { Currency } from '../currency';
import { ProductIcon } from '../ui/icons/product';
import { ShoppingBagIcon } from '../ui/icons/shopping-bag';
import { TransactionIcon } from '../ui/icons/transactions';
import { UserName } from '../user/user-name';
import { UserDetailRouter } from './user-details-router';
import { ScrollContainer } from '../common/scroll-container/scroll-container';
import { en } from '../../locales/en';
import { Tab, AlertText, PayPal } from '../../bricks';

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

const Component = ({ user, location }: UserDetailsHeaderProps) => {
  const currentUrl = location.pathname;
  const userUrl = `/user/${user.id}`;
  const settings = useSettings();
  const intl = useIntl();

  return (
    <div>
      <h1>
        <UserName center name={user.name} />
      </h1>
      <h1 title={intl.formatMessage({ id: en.BALANCE_TITLE })}>
        <AlertText value={user.balance}>
          <Currency value={user.balance} />
        </AlertText>
      </h1>

      <ScrollContainer style={{ justifyContent: 'space-between' }}>
        <Tab
          activeClassName="active"
          to={toggleTab(
            `/user/${user.id}/send_money_to_a_friend`,
            currentUrl,
            userUrl
          )}
        >
          <TransactionIcon />{' '}
          <FormattedMessage id="USER_TRANSACTION_CREATE_LINK" />
        </Tab>
        {settings.article.enabled && (
          <Tab
            activeClassName="active"
            to={toggleTab(`/user/${user.id}/article`, currentUrl, userUrl)}
          >
            <ShoppingBagIcon /> <FormattedMessage id="USER_ARTICLE_LINK" />
          </Tab>
        )}
        <Tab
          activeClassName="active"
          to={toggleTab(`/user/${user.id}/edit`, currentUrl, userUrl)}
        >
          <ProductIcon /> <FormattedMessage id="USER_EDIT_LINK" />
        </Tab>
        {settings.paypal.enabled && (
          <Tab
            activeClassName="active"
            to={toggleTab(`/user/${user.id}/paypal`, currentUrl, userUrl)}
          >
            <PayPal />
            <FormattedMessage id="PAYPAL_LINK" defaultMessage="Paypal" />
          </Tab>
        )}
      </ScrollContainer>
      <UserDetailRouter />
    </div>
  );
};

export const UserDetailsHeader = withRouter(Component);
