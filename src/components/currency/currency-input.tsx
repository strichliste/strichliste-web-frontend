import * as React from 'react';
import { FormattedNumber } from 'react-intl';

interface State {
  value: number;
}

interface Props {
  placeholder?: string;
  value?: number;
  onChange?(value: number): void;
}

export class CurrencyInput extends React.Component<Props, State> {
  public state = {
    value: this.props.value ? this.props.value / 100 : 0,
  };

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
          children={(test: string) => (
            <input
              placeholder={this.props.placeholder}
              value={test}
              onChange={this.updateValue}
              type="text"
            />
          )}
        />
      </>
    );
  }
}

export function convertFormattedNumberToCents(rawValue: string): number {
  return Number(rawValue.replace(/(-(?!\d))|[^0-9|-]/g, ''));
}
