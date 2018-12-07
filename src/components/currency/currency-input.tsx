import { Input } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedNumber } from 'react-intl';

interface State {
  lastPropValue: number | undefined;
  value: number;
  hasFocus: boolean;
}

interface Props {
  placeholder?: string;
  value?: number;
  autoFocus?: boolean;
  onChange?(value: number): void;
}

export class CurrencyInput extends React.Component<Props, State> {
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
    const cleanedNumber = convertFormattedNumberToCents(e.target.value);
    this.setState({ value: cleanedNumber / 100 });
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
            <div>
              <Input
                placeholder={this.props.placeholder}
                value={getPlaceholder(
                  this.props.placeholder,
                  formattedValue,
                  this.state.hasFocus
                )}
                onFocus={() => this.setState({ hasFocus: true })}
                onBlur={() => this.setState({ hasFocus: false })}
                onChange={this.updateValue}
                type="text"
                autoFocus={this.props.autoFocus}
              />
            </div>
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
