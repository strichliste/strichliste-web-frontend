import * as React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import {
  AutoGrid,
  HideByBreakPoint,
  breakPoints,
  styled,
} from 'bricks-of-sand';
import { FormattedMessage } from 'react-intl';
import { AppState } from '../../../store';
import {
  getFilteredUserIds,
  startLoadingUsers,
  updateSearch,
} from '../../../store/reducers';
import { NavTabMenus } from '../../common/nav-tab-menu';
import { ConnectedInlineCreateUserForm } from '../create-user-inline-form';
import { ConnectedUserCard } from '../user-card';

interface OwnProps {
  isActive: boolean;
  showCreateUserForm?: boolean;
}

interface StateProps {
  users: number[];
}

interface ActionProps {
  // tslint:disable-next-line:no-any
  updateSearch: any;
  // tslint:disable-next-line:no-any
  startLoadingUsers: any;
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
  zIndex: 10,
  position: 'absolute',
  marginLeft: '-2rem',
});

const CreateUserGridPosition = styled('div')({
  position: 'relative',
  '>div': {
    zIndex: 10,
    position: 'absolute',
    minWidth: '100%',
  },
});

export class User extends React.Component<UserProps> {
  public componentDidMount(): void {
    this.props.updateSearch({ query: '' });
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
          <NavTabMenus
            margin="2rem 1rem"
            breakpoint={768}
            label={<FormattedMessage id="USER_ACTIVE_LINK" />}
            tabs={[
              {
                to: '/user/active',
                message: <FormattedMessage id="USER_ACTIVE_LINK" />,
              },
              {
                to: '/user/inactive',
                message: <FormattedMessage id="USER_INACTIVE_LINK" />,
              },
            ]}
          />
          <HideByBreakPoint min={768} max={Infinity}>
            <CreateUserPosition>
              <ConnectedInlineCreateUserForm
                isActive={this.props.showCreateUserForm || false}
              />
            </CreateUserPosition>
          </HideByBreakPoint>
          <AutoGrid rows="5rem" columns="8rem">
            <HideByBreakPoint min={0} max={767}>
              <CreateUserGridPosition>
                <ConnectedInlineCreateUserForm
                  isActive={this.props.showCreateUserForm || false}
                />
              </CreateUserGridPosition>
            </HideByBreakPoint>
            {this.props.users.map(id => (
              <Link key={id} to={`/user/${id}`}>
                <ConnectedUserCard id={id} />
              </Link>
            ))}
          </AutoGrid>
        </GridWrapper>
      </>
    );
  }
}

const mapStateToProps = (state: AppState, props: OwnProps) => ({
  users: getFilteredUserIds(state, props.isActive),
});

const mapDispatchToProps: ActionProps = {
  startLoadingUsers,
  updateSearch,
};

export const ConnectedUser = connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
