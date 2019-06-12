import { Button, Flex } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { useDispatch } from 'redux-react-hook';

import { useUser, useSettings, useIsPaymentEnabled } from '../../store';
import {
  startLoadingTransactions,
  startLoadingUserDetails,
} from '../../store/reducers';
import { ArticleScanner } from '../article/article-scanner';
import { Payment, TransactionListItem } from '../transaction';
import { TransactionIcon } from '../ui/icons/transactions';
import { UserDetailsHeader } from '../user-details/user-details-header';
import { UserDetailsSeparator } from '../user-details/user-details-separator';
import { getUserDetailLink, getUserTransactionsLink } from './user-router';
import { ScrollToTop } from '../common/scroll-to-top';

// @ts-ignore
import styles from './user-details.module.css';

type UserDetailsProps = RouteComponentProps<{ id: string }>;
export const UserDetails = (props: UserDetailsProps) => {
  const dispatch = useDispatch();
  const userId = props.match.params.id;
  const user = useUser(userId);
  const inputRef = React.useRef(null);
  const payment = useSettings().payment;
  const isPaymentEnabled = useIsPaymentEnabled();

  React.useEffect(() => {
    startLoadingTransactions(dispatch, userId);
    startLoadingUserDetails(dispatch, userId);
    if (inputRef && inputRef.current) {
      // @ts-ignore
      inputRef.current.focus();
      // @ts-ignore
      inputRef.current.blur();
    }
  }, [props.match.params.id]);

  if (!user) {
    return <>LOADING...</>;
  }

  const transactions = user.transactions
    ? Object.keys(user.transactions)
        .map(a => Number(a))
        .sort((a, b) => b - a)
        .slice(0, 5)
    : [];
  return (
    <div>
      <ScrollToTop />
      <input ref={inputRef} type="text" hidden tabIndex={-1} />
      <ArticleScanner userId={user.id} />
      <UserDetailsHeader user={user} />
      <UserDetailsSeparator />
      <div className={styles.userDetailsGrid}>
        {isPaymentEnabled && (
          <div className={styles.payment}>
            <Payment userId={user.id} />
          </div>
        )}
        {payment.transactions.enabled && (
          <>
            {transactions.length ? (
              <div className={styles.transactions}>
                {transactions.map(id => (
                  <TransactionListItem key={id} id={id} />
                ))}
                <Flex justifyContent="flex-end">
                  <Button
                    onClick={() =>
                      props.history.push(getUserTransactionsLink(user.id))
                    }
                  >
                    <TransactionIcon />{' '}
                    <FormattedMessage id="USER_TRANSACTIONS_LINK" />
                  </Button>
                </Flex>
              </div>
            ) : (
              <Flex alignContent="center" justifyContent="center">
                <FormattedMessage id="TRANSACTION_EMPTY_STATE" />
              </Flex>
            )}
          </>
        )}
      </div>
      <Flex justifyContent="flex-end" margin="1rem">
        <Button
          onClick={() =>
            props.history.push(`${getUserDetailLink(user.id)}/metrics`)
          }
        >
          <TransactionIcon /> <FormattedMessage id="METRICS_HEADLINE" />
        </Button>
      </Flex>
    </div>
  );
};
