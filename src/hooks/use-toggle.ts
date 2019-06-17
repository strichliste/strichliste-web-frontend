import { useState } from 'react';

export function useToggle(
  initialState: boolean = false
): {
  toggle: boolean;
  updateToggle(): void;
  setToggle(toggle: boolean): void;
} {
  const [toggle, setToggle] = useState(initialState);

  const updateToggle = () => setToggle(!toggle);

  return { toggle, updateToggle, setToggle };
}
