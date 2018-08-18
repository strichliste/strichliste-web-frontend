import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { AppState, ThunkAction } from '../../store';
import { User, startLoadingUserDetails } from '../../store/reducers';
import { Button } from '../ui/button';

interface StateProps {
  details: User;
}

interface ActionProps {
  startLoadingUserDetails(id: number): ThunkAction<Promise<void>>;
}

type UserDetailsProps = StateProps &
  ActionProps &
  RouteComponentProps<{ id: number }>;

export class UserDetails extends React.Component<UserDetailsProps> {
  public componentDidMount(): void {
    console.log(this.props.match.params.id);
    this.props.startLoadingUserDetails(this.props.match.params.id);
  }

  public render(): JSX.Element {
    const user = this.props.details;
    return (
      <div>
        {user ? user.name : 'lade....'} Hallo
        <div>
          <Button>1</Button>
          <Button disabled color="red">
            2
          </Button>
          <Button color="red">5</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, { match }: UserDetailsProps) => ({
  details: getUser(state, match),
});

const mapDispatchToProps: ActionProps = {
  startLoadingUserDetails,
};

export const ConnectedUserDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDetails);

// tslint:disable-next-line:no-any
function getUser(state: AppState, match: any): User {
  console.log(state, match, state.user[match.params.id]);

  return state.user[match.params.id];
}
