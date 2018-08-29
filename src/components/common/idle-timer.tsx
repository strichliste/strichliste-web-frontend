import * as React from 'react';

interface State {
  timerId: NodeJS.Timer | number | undefined;
}

interface Props {
  timeout: number;
  onTimeOut(): void;
}

export class IdleTimer extends React.Component<Props, State> {
  public state = {
    timerId: undefined,
  };

  public componentDidMount(): void {
    document.addEventListener('click', this.resetTimer);
    document.addEventListener('touch', this.resetTimer);
    document.addEventListener('keyup', this.resetTimer);
  }

  public componentWillUnmount(): void {
    document.removeEventListener('click', this.resetTimer);
    document.removeEventListener('touch', this.resetTimer);
    document.removeEventListener('keyup', this.resetTimer);
  }

  public resetTimer = () => {
    clearTimeout(this.state.timerId);
    const id = setTimeout(this.props.onTimeOut, this.props.timeout);
    this.setState({ timerId: id });
  };

  // tslint:disable-next-line:prefer-function-over-method
  public render(): null {
    return null;
  }
}
