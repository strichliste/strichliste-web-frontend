import * as React from 'react';

export interface SearchInputProps {
  value: string;
  placeholder?: string;
  onChange(): void;
}

export function SearchInput(props: SearchInputProps): JSX.Element {
  return (
    <input
      autoFocus={true}
      value={props.value}
      placeholder={props.placeholder || ''}
      onChange={props.onChange}
      type="search"
    />
  );
}
