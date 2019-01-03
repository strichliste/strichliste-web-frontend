import * as React from 'react';

interface State {
  barcode: string;
  maybeBarcode: string;
  timeout?: number;
}

interface Props {
  render?(value: string): JSX.Element;
  onChange?(value: string): void;
}

export class Scanner extends React.Component<Props, State> {
  public state = {
    barcode: '',
    maybeBarcode: '',
    timeout: undefined,
  };

  public componentDidMount(): void {
    document.addEventListener('keyup', this.detection);
  }

  public componentWillUnmount(): void {
    document.removeEventListener('keyup', this.detection);
  }

  public detection = (event: KeyboardEvent): void => {
    const key = event.key;
    clearTimeout(this.state.timeout);

    if (key === 'Enter' && this.state.maybeBarcode.length > 6) {
      this.setState(state => ({
        barcode: state.maybeBarcode,
        maybeBarcode: '',
      }));
      if (this.props.onChange) {
        this.props.onChange(this.state.barcode);
      }
    } else if (/[a-zA-Z0-9]/i.test(key)) {
      this.setState(state => ({
        barcode: '',
        maybeBarcode: state.maybeBarcode + key,
      }));

      const id = setTimeout(() => {
        this.setState({ maybeBarcode: '' });
      }, 200);

      this.setState({ timeout: id });
    }
  };

  public render(): JSX.Element | null {
    if (!this.props.render) {
      return null;
    }
    return <>{this.props.render(this.state.barcode)}</>;
  }
}
