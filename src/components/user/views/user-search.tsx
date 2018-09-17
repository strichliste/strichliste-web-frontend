import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { ConnectedUserSelectionCards } from '..';
import { DefaultThunkAction } from '../../../store';
import { startLoadingUsers } from '../../../store/reducers';
import { BackButton } from '../../common';
import { FixedFooter } from '../../ui';

interface ActionProps {
  startLoadingUsers(stale?: boolean): DefaultThunkAction;
}

type Props = ActionProps & RouteComponentProps;

export class UserSearch extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.startLoadingUsers(true);
    this.props.startLoadingUsers(false);
  }

  public render(): JSX.Element {
    return (
      <>
        <ConnectedUserSelectionCards
          onSelect={user => this.props.history.push(`/user/${user.id}`)}
        />
        <FixedFooter>
          <BackButton />
        </FixedFooter>
      </>
    );
  }
}

const mapDispatchToProps: ActionProps = {
  startLoadingUsers,
};

export const ConnectedUserSearch = withRouter(
  connect(
    undefined,
    mapDispatchToProps
  )(UserSearch)
);
