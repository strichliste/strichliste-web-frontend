import * as React from 'react';
import { FormattedNumber } from 'react-intl';
import { Input } from '../../bricks';
// ...existing code...

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

interface Props {
  noNegative?: boolean;
  placeholder?: string;
  value?: number;
  autoFocus?: boolean;
  id?: string;
  onChange?(value: number): void;
}

export function CurrencyInput(props: Props): JSX.Element {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const getValueFromProps = React.useCallback(() => (props.value ? props.value / 100 : 0), [props.value]);

  const [lastPropValue, setLastPropValue] = React.useState<number | undefined>(props.value);
  const [value, setValue] = React.useState<number>(getValueFromProps());
  const [hasFocus, setHasFocus] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (props.value === undefined) {
      return;
    }
    if (lastPropValue !== props.value) {
      setLastPropValue(props.value);
      setValue(getValueFromProps());
    }
  }, [props.value, lastPropValue, getValueFromProps]);

  const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedNumber = props.noNegative
      ? Math.abs(convertFormattedNumberToCents(e.target.value))
      : convertFormattedNumberToCents(e.target.value);
    setValue(cleanedNumber / 100);
    if (inputRef && inputRef.current) {
      moveCursorToEnd(inputRef.current);
    }
    if (props.onChange) {
      props.onChange(cleanedNumber);
    }
  };

  return (
    <>
      {/* read currency from settings so input formatting matches selected currency */}
      <FormattedNumber
        minimumFractionDigits={2}
        value={value}
        children={(formattedValue: string) => (
          <Input
            id={props.id}
            ref={inputRef}
            style={{
              color: getPlaceholder(props.placeholder, formattedValue, hasFocus) === props.placeholder ? '#8e8e8e' : undefined,
            }}
            placeholder={props.placeholder}
            value={getPlaceholder(props.placeholder, formattedValue, hasFocus)}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            onChange={updateValue}
            type="tel"
            autoFocus={props.autoFocus}
          />
        )}
      />
    </>
  );
}
