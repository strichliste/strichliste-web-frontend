import * as React from 'react';
import { Card, theme } from '../ui';

interface State {
  isVisible: boolean;
}

interface Props {
  type?: 'error';
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
    const cardProps =
      this.props.type === 'error'
        ? {
            color: theme.white,
            background: theme.red,
          }
        : {};
    if (!this.state.isVisible) {
      return null;
    }

    return <Card {...cardProps}>{this.props.children}</Card>;
  }
}
