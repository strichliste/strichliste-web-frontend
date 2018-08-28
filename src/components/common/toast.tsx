import * as React from 'react';
import { Card } from '../ui';

interface State {
  isVisible: boolean;
}

interface Props {
  fadeOutSeconds: number;
  onFadeOut?(): void;
}

export class Toast extends React.Component<Props, State> {
  public state = { isVisible: true };

  public componentDidMount(): void {
    setTimeout(() => {
      this.setState({ isVisible: false });
      if (this.props.onFadeOut) {
        this.props.onFadeOut();
      }
    }, this.props.fadeOutSeconds * 1000);
  }

  public render(): JSX.Element | null {
    if (!this.state.isVisible) {
      return null;
    }

    return <Card>{this.props.children}</Card>;
  }
}
