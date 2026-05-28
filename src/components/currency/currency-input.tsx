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
  /** Accessible name when no <label htmlFor> wires this input up. */
  'aria-label'?: string;
  onChange?(value: number): void;
}

export function CurrencyInput({
  noNegative,
  placeholder,
  value,
  autoFocus,
  id,
  'aria-label': ariaLabel,
  onChange,
}: Props): React.JSX.Element {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [hasFocus, setHasFocus] = React.useState(false);

  // Controlled-or-uncontrolled discipline (React standard): if a parent
  // passes `value`, we mirror it directly — no local state, no prop-sync
  // effect. If not, internal state holds the user's input. The mode is
  // pinned to mount (props.value transitioning from defined↔undefined
  // mid-life would be a misuse, same as <input value=…/>).
  const isControlled = value !== undefined;
  const [internalCents, setInternalCents] = React.useState(0);
  const cents = isControlled ? (value as number) : internalCents;
  const displayValue = cents / 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = noNegative
      ? Math.abs(convertFormattedNumberToCents(e.target.value))
      : convertFormattedNumberToCents(e.target.value);
    if (!isControlled) setInternalCents(next);
    moveCursorToEnd(inputRef.current);
    onChange?.(next);
  };

  return (
    <FormattedNumber minimumFractionDigits={2} value={displayValue}>
      {(formattedValue: string) => {
        const shown = getDisplay(placeholder, formattedValue, hasFocus);
        return (
          <Input
            id={id}
            ref={inputRef}
            aria-label={ariaLabel ?? placeholder}
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
