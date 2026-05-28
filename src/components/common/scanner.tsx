import React from 'react';

interface Props {
  render?(value: string): React.JSX.Element;
  onChange?(value: string): void;
}

const HiddenInput = () => (
  <input
    style={{ opacity: 0 }}
    value=""
    onChange={() => {}}
    type="text"
    hidden
    tabIndex={-1}
    aria-hidden="true"
    readOnly
  />
);

/**
 * Listens for hardware-barcode-reader keystrokes anywhere in the document.
 * A barcode is a fast run of alphanumeric keys (`/[a-zA-Z0-9]/` only — `-`/`.`
 * are dropped, so e.g. ISBN-10 dashes never make it into the buffer) ended
 * by Enter. If Enter doesn't arrive within 200ms of the last keystroke, the
 * rolling buffer resets.
 *
 * The buffer lives in a ref so the keydown handler is always reading the
 * current value (avoids the stale-closure bug the class version had).
 */
export function Scanner({ render, onChange }: Props): React.JSX.Element {
  const [barcode, setBarcode] = React.useState('');
  const maybeBarcodeRef = React.useRef('');
  const resetTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  // Keep the latest `onChange` in a ref so the document-level keydown listener
  // doesn't need to be torn down and re-added every time the parent re-renders
  // with a fresh callback identity.
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    const detection = (event: KeyboardEvent) => {
      if (event.repeat) return;
      clearTimeout(resetTimerRef.current);
      const key = event.key;
      if (key === 'Enter' && maybeBarcodeRef.current.length > 6) {
        event.preventDefault();
        const scanned = maybeBarcodeRef.current;
        maybeBarcodeRef.current = '';
        setBarcode(scanned);
        onChangeRef.current?.(scanned);
        return;
      }
      if (
        key.length === 1 &&
        /[a-zA-Z0-9]/.test(key) &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        maybeBarcodeRef.current += key;
        resetTimerRef.current = setTimeout(() => {
          maybeBarcodeRef.current = '';
        }, 200);
      }
    };
    document.addEventListener('keydown', detection);
    return () => {
      document.removeEventListener('keydown', detection);
      clearTimeout(resetTimerRef.current);
    };
  }, []);

  if (!render) {
    return <HiddenInput />;
  }
  return (
    <>
      <HiddenInput />
      {render(barcode)}
    </>
  );
}
