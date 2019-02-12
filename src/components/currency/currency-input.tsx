import { Input } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedNumber } from 'react-intl';

// tslint:disable-next-line:no-any
function moveCursorToEnd(el: any): void {
  window.setTimeout(() => {
    if (typeof el.selectionStart === 'number') {
      el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange !== 'undefined') {
      const range = el.createTextRange();
      range.collapse(false);
      range.select();
    }
  }, 1);
}

interface State {
  lastPropValue: number | undefined;
  value: number;
  hasFocus: boolean;
}

interface Props {
  noNegative?: boolean;
  placeholder?: string;
  value?: number;
  autoFocus?: boolean;
  onChange?(value: number): void;
}

export class CurrencyInput extends React.Component<Props, State> {
  public inputRef = React.createRef();
  public state = {
    lastPropValue: 0,
    value: this.getValueFromProps(),
    hasFocus: false,
  };

  public getValueFromProps(): number {
    return this.props.value ? this.props.value / 100 : 0;
  }

  public componentDidUpdate(): void {
    if (this.props.value === undefined) {
      return;
    }

    if (this.state.lastPropValue !== this.props.value) {
      const value = this.getValueFromProps();
      this.setState({ lastPropValue: this.props.value, value });
    }
  }

  public updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedNumber = this.props.noNegative
      ? Math.abs(convertFormattedNumberToCents(e.target.value))
      : convertFormattedNumberToCents(e.target.value);
    this.setState({ value: cleanedNumber / 100 }, () => {
      if (this.inputRef && this.inputRef.current) {
        moveCursorToEnd(this.inputRef.current);
      }
    });
    if (this.props.onChange) {
      this.props.onChange(cleanedNumber);
    }
  };

  public render(): JSX.Element {
    return (
      <>
        <FormattedNumber
          minimumFractionDigits={2}
          value={this.state.value}
          children={(formattedValue: string) => (
            <Input
              // @ts-ignore
              ref={this.inputRef}
              style={{
                color:
                  getPlaceholder(
                    this.props.placeholder,
                    formattedValue,
                    this.state.hasFocus
                  ) === this.props.placeholder
                    ? '#8e8e8e'
                    : undefined,
              }}
              placeholder={this.props.placeholder}
              value={getPlaceholder(
                this.props.placeholder,
                formattedValue,
                this.state.hasFocus
              )}
              onFocus={() => this.setState({ hasFocus: true })}
              onBlur={() =>
                this.setState({
                  hasFocus: false,
                })
              }
              onChange={this.updateValue}
              type="tel"
              autoFocus={this.props.autoFocus}
            />
          )}
        />
      </>
    );
  }
}

function getPlaceholder(
  placeholder: string | undefined,
  value: string,
  hasFocus: boolean
): string {
  return !placeholder || value !== '0.00' || hasFocus ? value : placeholder;
}

export function convertFormattedNumberToCents(rawValue: string): number {
  return Number(rawValue.replace(/(-(?!\d))|[^0-9|-]/g, ''));
}
