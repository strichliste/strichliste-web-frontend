import * as React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, RouteComponentProps } from 'react-router-dom';

import { AutoGrid } from 'bricks-of-sand';
import styled from 'react-emotion';
import { FormattedMessage } from 'react-intl';
import { AppState, ThunkAction } from '../../../store';
import { startLoadingUsers } from '../../../store/reducers';
import { Tabs, breakPoints } from '../../ui';
import { ConnectedInlineCreateUserForm } from '../create-user-inline-form';
import { ConnectedUserCard } from '../user-card';

interface OwnProps {
  isActive: boolean;
}

interface StateProps {
  users: string[];
}

interface ActionProps {
  startLoadingUsers(
    isActive?: boolean,
    isDisabled?: boolean
  ): ThunkAction<Promise<void>>;
}

type UserProps = OwnProps & StateProps & ActionProps & RouteComponentProps;
let lastStale: boolean;

const GridWrapper = styled('div')({
  marginLeft: '0rem',
  [breakPoints.tablet]: {
    marginLeft: '8rem',
  },
});

const CreateUserPosition = styled('div')({
  [breakPoints.tablet]: {
    position: 'absolute',
    zIndex: 10,
    marginLeft: '-2rem',
  },
});

export class User extends React.Component<UserProps> {
  public componentDidMount(): void {
    this.props.startLoadingUsers(this.props.isActive, false);
  }

  public componentDidUpdate(): void {
    if (lastStale !== this.props.isActive) {
      this.props.startLoadingUsers(this.props.isActive, false);
    }
    lastStale = this.props.isActive;
  }

  public render(): JSX.Element {
    return (
      <>
        <GridWrapper>
          <Tabs margin="2rem 1rem">
            <NavLink activeClassName="active" to="/user/active">
              <FormattedMessage id="USER_ACTIVE_LINK" />
            </NavLink>
            <NavLink activeClassName="active" to="/user/inactive">
              <FormattedMessage id="USER_INACTIVE_LINK" />
            </NavLink>
          </Tabs>
          <CreateUserPosition>
            <ConnectedInlineCreateUserForm />
          </CreateUserPosition>
          <AutoGrid rows="5rem" columns="10rem">
            {this.props.users.map(id => (
              <Link key={id} to={'/user/' + id}>
                <ConnectedUserCard id={Number(id)} />
              </Link>
            ))}
          </AutoGrid>
        </GridWrapper>
      </>
    );
  }
}

const mapStateToProps = (state: AppState, props: OwnProps) => ({
  users: getUsers(state, props.isActive),
});

function getUsers(state: AppState, isActive: boolean): string[] {
  return Object.values(state.user)
    .filter(user => user.isActive === isActive && user.isDisabled === false)
    .map(user => user.id);
}

const mapDispatchToProps: ActionProps = {
  startLoadingUsers,
};

export const ConnectedUser = connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
