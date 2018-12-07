import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { ResponsiveGrid, withTheme } from 'bricks-of-sand';
import styled from 'react-emotion';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
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
  }))
);

export class UserDetails extends React.Component<UserDetailsProps> {
  public componentDidMount(): void {
    this.props.startLoadingUserDetails(Number(this.props.match.params.id));
    this.props.startLoadingTransactions(Number(this.props.match.params.id));
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
      <>
        <ConnectedArticleScanner userId={user.id} />
        <UserDetailsHeader user={user} />
        <UserDetailsSeparator />
        <ResponsiveGrid tabletColumns="24rem 1fr">
          <div>
            <ConnectedPayment userId={user.id} />
          </div>

          <StyledTransactionWrapper>
            {transactions.map(id => (
              <ConnectedTransactionListItem key={id} id={id} />
            ))}
            <Link to={this.props.match.url + '/transactions/0'}>
              <TransactionIcon />{' '}
              <FormattedMessage id="USER_TRANSACTIONS_LINK" />
            </Link>
          </StyledTransactionWrapper>
        </ResponsiveGrid>
      </>
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
