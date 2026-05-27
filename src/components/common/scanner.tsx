import React from 'react';

interface State {
  barcode: string;
  maybeBarcode: string;
  timeout?: NodeJS.Timer | number;
}

interface Props {
  render?(value: string): React.JSX.Element;
  onChange?(value: string): void;
}

export class Scanner extends React.Component<Props, State> {
  public state = {
    barcode: '',
    maybeBarcode: '',
    timeout: undefined,
  };
  public inputRef = React.createRef<HTMLInputElement>();

  public componentDidMount(): void {
    document.addEventListener('keydown', this.detection);
  }

  public componentWillUnmount(): void {
    document.removeEventListener('keydown', this.detection);
  }

  public detection = (event: KeyboardEvent): void => {
    if (event.repeat) return;
    const key = event.key;

    clearTimeout(this.state.timeout);

    if (key === 'Enter' && this.state.maybeBarcode.length > 6) {
      event.preventDefault();
      this.setState(state => ({
        barcode: state.maybeBarcode,
        maybeBarcode: '',
      }));
      if (this.props.onChange) {
        this.props.onChange(this.state.barcode);
      }
    } else if (key.length === 1 && /[a-zA-Z0-9]/.test(key) && !event.ctrlKey && !event.altKey && !event.metaKey) {
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

  public render(): React.JSX.Element | null {
    if (!this.props.render) {
      return (
        <input
          style={{ opacity: 0 }}
          value=""
          onChange={() => {}}
          ref={this.inputRef}
          type="text"
          hidden
          tabIndex={-1}
          aria-hidden="true"
        />
      );
    }
    return (
      <>
        <input
          style={{ opacity: 0 }}
          value=""
          onChange={() => {}}
          ref={this.inputRef}
          type="text"
          hidden
          tabIndex={-1}
          aria-hidden="true"
        />
        {this.props.render(this.state.barcode)}
      </>
    );
  }
}
