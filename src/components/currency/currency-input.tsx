import * as React from 'react';
import { FormattedNumber } from 'react-intl';
import { Input } from '../../bricks';

function getDisplay(
  placeholder: string | undefined,
  formatted: string,
  hasFocus: boolean
): string {
  return !placeholder || formatted !== '0.00' || hasFocus
    ? formatted
    : placeholder;
}

export function convertFormattedNumberToCents(rawValue: string): number {
  return Number(rawValue.replace(/(-(?!\d))|[^0-9|-]/g, ''));
}

function moveCursorToEnd(el: HTMLInputElement | null): void {
  if (!el) return;
  window.setTimeout(() => {
    if (typeof el.selectionStart === 'number') {
      el.selectionStart = el.selectionEnd = el.value.length;
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

export function CurrencyInput({
  noNegative,
  placeholder,
  value,
  autoFocus,
  id,
  onChange,
}: Props): React.JSX.Element {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [hasFocus, setHasFocus] = React.useState(false);
  // Local display state mirrors the (cents) prop, but can also be driven by
  // the user typing when no `value` prop is passed (uncontrolled use, e.g.
  // the article form).
  const [displayValue, setDisplayValue] = React.useState(
    value !== undefined ? value / 100 : 0
  );

  // Keep the local display in sync when the parent updates `value`.
  React.useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(value / 100);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cents = noNegative
      ? Math.abs(convertFormattedNumberToCents(e.target.value))
      : convertFormattedNumberToCents(e.target.value);
    setDisplayValue(cents / 100);
    moveCursorToEnd(inputRef.current);
    onChange?.(cents);
  };

  return (
    <FormattedNumber minimumFractionDigits={2} value={displayValue}>
      {(formattedValue: string) => {
        const shown = getDisplay(placeholder, formattedValue, hasFocus);
        return (
          <Input
            id={id}
            ref={inputRef}
            style={{ color: shown === placeholder ? '#6e6e6e' : undefined }}
            placeholder={placeholder}
            value={shown}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            onChange={handleChange}
            type="tel"
            autoFocus={autoFocus}
          />
        );
      }}
    </FormattedNumber>
  );
}
