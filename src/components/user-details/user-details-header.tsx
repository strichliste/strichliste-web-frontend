import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { User } from '../../store/reducers';
import { Currency } from '../currency';
import { UserName } from '../user/user-name';
import { UserDetailRouter } from './user-details-router';
import {
  Tab,
  AlertText,
  PayPal,
  TransactionIcon,
  ShoppingBagIcon,
  ProductIcon,
  ScrollContainer,
} from '../../bricks';

import styles from './user-details-header.module.css';
import { useSettings } from '../settings/useSettings';

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
    <>
      <div className={styles.header}>
        <h2>
          <UserName center name={user.name} />
        </h2>
        <h3 title={intl.formatMessage({ id: 'BALANCE_TITLE' })}>
          <AlertText value={user.balance}>
            <Currency value={user.balance} />
          </AlertText>
        </h3>
      </div>
      <div className={styles.wrapper}>
        <ScrollContainer
          style={{ justifyContent: 'space-between', marginBottom: '1rem' }}
        >
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
    </>
  );
};

export const UserDetailsHeader = withRouter(Component);
