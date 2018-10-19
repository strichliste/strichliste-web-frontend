import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { Card } from 'bricks-of-sand';
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
import { BackButton } from '../common';
import { Currency } from '../currency';
import { ConnectedPayment, ConnectedTransactionListItem } from '../transaction';
import {
  AlertText,
  Column,
  FixedFooter,
  ListItem,
  Row,
  SplitLayout,
} from '../ui';
import { UserArticleTransactionLink } from './user-router';

interface StateProps {
  details: User;
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

        <SplitLayout>
          <Card>
            <SplitLayout>
              {user.name}
              <Link to={`${user.id}/edit`}>
                <FormattedMessage id="USER_EDIT_LINK" />
              </Link>
              <AlertText value={user.balance}>
                <Currency value={user.balance} />
              </AlertText>
            </SplitLayout>

            <Row>
              <Column>
                <ConnectedPayment userId={user.id} />
              </Column>
            </Row>
            <div>
              <CreateUserTransactionLink />
            </div>
            <div>
              <UserArticleTransactionLink id={user.id} />
            </div>
          </Card>

          <Card>
            <ListItem>
              <Link to={this.props.match.url + '/transactions/0'}>
                <FormattedMessage id="USER_TRANSACTIONS" />{' '}
              </Link>
            </ListItem>
            {transactions.map(id => (
              <ConnectedTransactionListItem key={id} id={id} />
            ))}
          </Card>
        </SplitLayout>
        <FixedFooter>
          <BackButton />
        </FixedFooter>
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
