import { useState } from 'react';

export function useInput<T = string>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  // tslint:disable-next-line:no-any
  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  return [value, onChange];
}
