import {
  Button,
  Flex,
  ResponsiveGrid,
  styled,
  withTheme,
} from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { AppState } from '../../store';
import {
  User,
  getUser,
  startLoadingTransactions,
  startLoadingUserDetails,
} from '../../store/reducers';
import { ConnectedArticleScanner } from '../article/article-scanner';
import { ConnectedPayment, ConnectedTransactionListItem } from '../transaction';
import { TransactionIcon } from '../ui/icons/transactions';
import { UserDetailsHeader } from '../user-details/user-details-header';
import { UserDetailsSeparator } from '../user-details/user-details-separator';
import { getUserDetailLink, getUserTransactionsLink } from './user-router';

interface StateProps {
  details?: User;
}

interface ActionProps {
  // tslint:disable-next-line:no-any
  startLoadingUserDetails(id: number): any;
  // tslint:disable-next-line:no-any
  startLoadingTransactions(id: number): any;
}

type UserDetailsProps = StateProps &
  ActionProps &
  RouteComponentProps<{ id: string }>;

const StyledTransactionWrapper = withTheme(
  styled('div')({}, props => ({
    [props.theme.breakPoints.tablet]: {
      margin: '0 0 0 3rem',
    },
    a: {
      textAlign: 'right',
      display: 'block',
    },
  }))
);

const EmptyState = styled('div')({
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export class UserDetails extends React.Component<UserDetailsProps> {
  public componentDidMount(): void {
    this.props.startLoadingUserDetails(Number(this.props.match.params.id));
    this.props.startLoadingTransactions(Number(this.props.match.params.id));
  }

  public componentDidUpdate(prevProps: UserDetailsProps): void {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.startLoadingTransactions(Number(this.props.match.params.id));
    }
  }

  public render(): JSX.Element {
    const user = this.props.details;
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
        <ConnectedArticleScanner userId={user.id} />
        <UserDetailsHeader user={user} />
        <UserDetailsSeparator />
        <ResponsiveGrid margin="1rem" tabletColumns="24rem 1fr">
          <div>
            <ConnectedPayment userId={user.id} />
          </div>
          {transactions.length ? (
            <StyledTransactionWrapper>
              {transactions.map(id => (
                <ConnectedTransactionListItem key={id} id={id} />
              ))}
              <Flex justifyContent="flex-end">
                <Button
                  onClick={() =>
                    this.props.history.push(getUserTransactionsLink(user.id))
                  }
                >
                  <TransactionIcon />{' '}
                  <FormattedMessage id="USER_TRANSACTIONS_LINK" />
                </Button>
              </Flex>
            </StyledTransactionWrapper>
          ) : (
            <EmptyState>
              <FormattedMessage id="TRANSACTION_EMPTY_STATE" />
            </EmptyState>
          )}
        </ResponsiveGrid>
        <Flex justifyContent="flex-end" margin="1rem">
          <Button
            onClick={() =>
              this.props.history.push(`${getUserDetailLink(user.id)}/metrics`)
            }
          >
            <TransactionIcon /> <FormattedMessage id="METRICS_HEADLINE" />
          </Button>
        </Flex>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, { match }: UserDetailsProps) => ({
  details: getUser(state, Number(match.params.id)),
});

const mapDispatchToProps: ActionProps = {
  startLoadingUserDetails,
  startLoadingTransactions,
};

export const ConnectedUserDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDetails);
