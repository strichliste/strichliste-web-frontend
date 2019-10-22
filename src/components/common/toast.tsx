import * as React from 'react';
import { Card } from '../../bricks';

interface State {
  isVisible: boolean;
  timeoutId: number | NodeJS.Timer;
}

interface Props {
  type?: 'error';
  fadeOutSeconds: number;
  onFadeOut?(): void;
}

export class Toast extends React.Component<Props, State> {
  public state = { isVisible: true, timeoutId: 0 };

  public componentDidMount(): void {
    const timeoutId = setTimeout(() => {
      this.setState({ isVisible: false });
      if (this.props.onFadeOut) {
        this.props.onFadeOut();
      }
    }, this.props.fadeOutSeconds * 1000);
    this.setState({ timeoutId });
  }

  public componentWillUnmount(): void {
    clearTimeout(this.state.timeoutId);
  }

  public render(): JSX.Element | null {
    if (!this.state.isVisible) {
      return null;
    }

    return (
      <Card error={this.props.type === 'error'}>{this.props.children}</Card>
    );
  }
}
