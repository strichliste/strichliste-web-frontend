import { useState } from 'react';

export function useInput<T = string>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  return [value, onChange];
}
