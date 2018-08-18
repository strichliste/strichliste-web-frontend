import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { AppState, ThunkAction } from '../../store';
import { startLoadingUsers } from '../../store/reducers';
import { AutoGrid, Card } from '../ui';
import { SearchFrom } from '../ui/search-form';
import { ConnectedUserCard } from '../user/user-card';

interface StateProps {
  users: string[];
}

interface ActionProps {
  startLoadingUsers(): ThunkAction<Promise<void>>;
}

type UserProps = StateProps & ActionProps;

export class User extends React.Component<UserProps> {
  public componentDidMount(): void {
    // if (this.props.users.length === 0) {
    this.props.startLoadingUsers();
    // }
  }

  public render(): JSX.Element {
    return (
      <>
        <SearchFrom
          label="test"
          value="hallo"
          placeholder="search" // tslint:disable-next-line:no-empty
          onSubmit={() => {}} // tslint:disable-next-line:no-empty
          onChange={() => {}}
        />
        <AutoGrid>
          <Link to="/createUser">
            <Card>+</Card>
          </Link>

          {this.props.users.map(id => (
            <Link key={id} to={'/user/' + id}>
              <ConnectedUserCard id={Number(id)} />
            </Link>
          ))}
        </AutoGrid>
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  users: Object.keys(state.user),
});

const mapDispatchToProps: ActionProps = {
  startLoadingUsers,
};

export const ConnectedUser = connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
