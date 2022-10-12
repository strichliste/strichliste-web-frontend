import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';

import {
  startLoadingTransactions,
  startLoadingUserDetails,
} from '../../store/reducers';
import { ArticleScanner } from '../article/article-scanner';
import { Payment, TransactionListItem } from '../transaction';
import { UserDetailsHeader } from '../user-details/user-details-header';
import { UserDetailsSeparator } from '../user-details/user-details-separator';
import { getUserDetailLink, getUserTransactionsLink } from './user-router';
import { ScrollToTop } from '../common/scroll-to-top';

import { Button, Flex, TransactionIcon } from '../../bricks';
import { useSettings, isPaymentEnabled } from '../settings/useSettings';
import { useUser } from '../../store';

import styles from './user-details.module.css';

type UserDetailsProps = RouteComponentProps<{ id: string }>;
export const UserDetails = (props: UserDetailsProps) => {
  const dispatch = useDispatch();
  const userId = props.match.params.id;
  const user = useUser(userId);
  const inputRef = React.useRef(null);
  const payment = useSettings().payment;

  React.useEffect(() => {
    startLoadingTransactions(dispatch, userId);
    startLoadingUserDetails(dispatch, userId);
    if (inputRef && inputRef.current) {
      // @ts-expect-error js-ts
      inputRef.current.focus();
      // @ts-expect-error js-ts
      inputRef.current.blur();
    }
    // eslint-disable-next-line
  }, [props.match.params.id]);

  if (!user) {
    return <>LOADING...</>;
  }

  const transactions = user.transactions
    ? Object.keys(user.transactions)
        .map((a) => Number(a))
        .sort((a, b) => b - a)
        .slice(0, 5)
    : [];
  const areTransactionsEnabled = payment.transactions.enabled;
  return (
    <div>
      <ScrollToTop />
      <input ref={inputRef} type="text" hidden tabIndex={-1} />
      <ArticleScanner userId={user.id} />
      <UserDetailsHeader user={user} />
      <UserDetailsSeparator />
      <div
        className={classnames(styles.grid, {
          [styles.bothEnabled]:
            isPaymentEnabled(payment) && areTransactionsEnabled,
        })}
      >
        {isPaymentEnabled(payment) && <Payment userId={user.id} />}
        {areTransactionsEnabled && (
          <>
            {transactions.length ? (
              <div className={styles.transactions}>
                {transactions.map((id, index) => (
                  <TransactionListItem
                    key={id}
                    first={index === 0}
                    id={String(id)}
                  />
                ))}
              </div>
            ) : (
              <Flex alignContent="center" justifyContent="center">
                <FormattedMessage id="TRANSACTION_EMPTY_STATE" />
              </Flex>
            )}
          </>
        )}
      </div>
      {areTransactionsEnabled && transactions.length > 0 && (
        <Flex justifyContent="flex-end" margin="0 1rem">
          <Button
            onClick={() => props.history.push(getUserTransactionsLink(user.id))}
          >
            <TransactionIcon /> <FormattedMessage id="USER_TRANSACTIONS_LINK" />
          </Button>
        </Flex>
      )}
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
