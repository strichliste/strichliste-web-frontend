import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { AppState } from '../../store';

interface State {
  timerId: NodeJS.Timer | number | undefined;
}
interface StateProps {
  idleTimer: number;
}
interface OwnProps extends RouteComponentProps {
  onTimeOut?(): void;
}

type Props = StateProps & OwnProps;

export class IdleTimer extends React.Component<Props, State> {
  public state = {
    timerId: undefined,
  };

  public componentDidMount(): void {
    this.resetTimer();
    document.addEventListener('scroll', this.resetTimer);
    document.addEventListener('click', this.resetTimer);
    document.addEventListener('touch', this.resetTimer);
    document.addEventListener('keyup', this.resetTimer);
  }

  public componentWillUnmount(): void {
    document.removeEventListener('scroll', this.resetTimer);
    document.removeEventListener('click', this.resetTimer);
    document.removeEventListener('touch', this.resetTimer);
    document.removeEventListener('keyup', this.resetTimer);
    clearTimeout(this.state.timerId);
  }

  public handleTimeOut = () => {
    if (typeof this.props.onTimeOut === 'function') {
      this.props.onTimeOut();
    } else {
      this.props.history.push('/');
    }
  };

  public resetTimer = () => {
    clearTimeout(this.state.timerId);
    const id = setTimeout(this.handleTimeOut, this.props.idleTimer);
    this.setState({ timerId: id });
  };

  // tslint:disable-next-line:prefer-function-over-method
  public render(): null {
    return null;
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  idleTimer: state.settings.idleTimer,
});

export const ConnectedIdleTimer = withRouter(
  connect(mapStateToProps)(IdleTimer)
);
