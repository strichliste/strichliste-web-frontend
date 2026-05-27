import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from '../../routing';
import classnames from 'classnames';

import {
  useUser,
  useSettings,
  useIsPaymentEnabled,
  useUserTransactions,
} from '../../store';
import { ArticleScanner } from '../article/article-scanner';
import { Payment, TransactionListItem } from '../transaction';
import { UserDetailsHeader } from '../user-details/user-details-header';
import { UserDetailsSeparator } from '../user-details/user-details-separator';
import { getUserDetailLink, getUserTransactionsLink } from './user-router';
import { ScrollToTop } from '../common/scroll-to-top';

import styles from './user-details.module.css';
import { Button, Flex, TransactionIcon } from '../../bricks';

type UserDetailsProps = RouteComponentProps<{ id: string }>;
export const UserDetails = (props: UserDetailsProps) => {
  const userId = props.match.params.id;
  const user = useUser(userId);
  const inputRef = React.useRef(null);
  const payment = useSettings().payment;
  const isPaymentEnabled = useIsPaymentEnabled();
  const { transactions } = useUserTransactions(userId, 0, 5);

  React.useEffect(() => {
    if (inputRef && inputRef.current) {
      // @ts-expect-error js-ts
      inputRef.current.focus();
      // @ts-expect-error js-ts
      inputRef.current.blur();
    }
  }, [props.match.params.id]);

  if (!user) {
    return <>LOADING...</>;
  }

  const areTransactionsEnabled = payment.transactions.enabled;
  return (
    <div>
      <ScrollToTop />
      <input
        ref={inputRef}
        type="text"
        hidden
        tabIndex={-1}
        aria-hidden="true"
        readOnly
      />
      <ArticleScanner userId={user.id} />
      <UserDetailsHeader user={user} />
      <UserDetailsSeparator />
      <div
        className={classnames(styles.grid, {
          [styles.bothEnabled]: isPaymentEnabled && areTransactionsEnabled,
        })}
      >
        {isPaymentEnabled && <Payment userId={user.id} />}
        {areTransactionsEnabled && (
          <>
            {transactions.length ? (
              <div className={styles.transactions}>
                {transactions.map((transaction, index) => (
                  <TransactionListItem
                    key={transaction.id}
                    first={index === 0}
                    transaction={transaction}
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
