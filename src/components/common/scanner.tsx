import * as React from 'react';

interface State {
  barcode: string;
  maybeBarcode: string;
  timeout?: NodeJS.Timer | number;
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
    const keyCode = event.keyCode;
    clearTimeout(this.state.timeout);

    if (keyCode === 13 && this.state.maybeBarcode.length > 6) {
      this.setState(state => ({
        barcode: state.maybeBarcode,
        maybeBarcode: '',
      }));
      if (this.props.onChange) {
        this.props.onChange(this.state.barcode);
      }
    } else if (
      (keyCode > 47 && keyCode < 58) ||
      (keyCode > 64 && keyCode < 91)
    ) {
      this.setState(state => ({
        barcode: '',
        maybeBarcode: state.maybeBarcode + String.fromCharCode(keyCode),
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
