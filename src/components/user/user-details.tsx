import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { Flex, ResponsiveGrid, theme, withTheme } from 'bricks-of-sand';
import styled from 'react-emotion';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { CreateUserTransactionLink } from '.';
import { AppState } from '../../store';
import {
  User,
  getUser,
  startLoadingTransactions,
  startLoadingUserDetails,
} from '../../store/reducers';
import { ConnectedArticleScanner } from '../article/article-scanner';
import { Currency } from '../currency';
import { ConnectedPayment, ConnectedTransactionListItem } from '../transaction';
import { AlertText } from '../ui';
import { EditIcon } from '../ui/icons/edit';
import { ProductIcon } from '../ui/icons/product';
import { TransactionIcon } from '../ui/icons/transactions';
import { UserArticleTransactionLink } from './user-router';

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

const StyledUser = withTheme(
  styled('div')({
    [theme.breakPoints.tablet]: {
      marginTop: '5rem',
    },
  })
);

const StyledTransactionWrapper = withTheme(
  styled('div')({}, props => ({
    [props.theme.breakPoints.tablet]: {
      margin: '0 0 0 3rem',
    },
  }))
);

const UserHeader = withTheme(
  styled('div')(
    {
      h1: {
        textTransform: 'none',
        fontSize: '2rem',
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
      <StyledUser>
        <ConnectedArticleScanner userId={user.id} />
        <UserHeader>
          <Flex justifyContent="space-between">
            <h1>{user.name}</h1>
            <h1>
              <AlertText value={user.balance}>
                <Currency value={user.balance} />
              </AlertText>
            </h1>
          </Flex>
          <Flex justifyContent="space-between" margin="1rem 0">
            <h2>
              <Link to={`${user.id}/edit`}>
                <ProductIcon /> <FormattedMessage id="USER_EDIT_LINK" />
              </Link>
            </h2>
            <h2>
              <TransactionIcon /> <CreateUserTransactionLink />
            </h2>
            <h2>
              <EditIcon /> <UserArticleTransactionLink id={user.id} />
            </h2>
          </Flex>
        </UserHeader>
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
      </StyledUser>
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
