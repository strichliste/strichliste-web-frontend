import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

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
  Card,
  Column,
  FixedFooter,
  ListItem,
  Row,
  SplitLayout,
} from '../ui';

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
  RouteComponentProps<{ id: number }>;

export class UserDetails extends React.Component<UserDetailsProps> {
  public async componentDidMount(): Promise<void> {
    await this.props.startLoadingUserDetails(this.props.match.params.id);
    await this.props.startLoadingTransactions(this.props.match.params.id);
  }

  public render(): JSX.Element {
    const user = this.props.details;
    if (!user) {
      return <>LOADING...</>;
    }
    return (
      <>
        <ConnectedArticleScanner userId={user.id} />

        <SplitLayout>
          <Card>
            <SplitLayout>
              {user.name}

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
          </Card>

          <Card>
            <ListItem>
              <Link to={this.props.match.url + '/transactions'}>
                <FormattedMessage id="USER_TRANSACTIONS" />{' '}
              </Link>
            </ListItem>
            {user.transactions &&
              Object.keys(user.transactions)
                .sort((a, b) => Number(b) - Number(a))
                .slice(0, 5)
                .map(id => <ConnectedTransactionListItem key={id} id={id} />)}
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
  details: getUser(state, match.params.id),
});

const mapDispatchToProps: ActionProps = {
  startLoadingUserDetails,
  startLoadingTransactions,
};

export const ConnectedUserDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDetails);
