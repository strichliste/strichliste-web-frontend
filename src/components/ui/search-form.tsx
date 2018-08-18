import * as React from 'react';
import { Button } from './button';
import { SearchInput } from './search-input';

export interface SearchFormProps {
  value: string;
  label: string;
  placeholder: string;
  onSubmit(): void;
  onChange(): void;
}

export function SearchFrom(props: SearchFormProps): JSX.Element {
  return (
    <form onSubmit={props.onSubmit}>
      <SearchInput {...props} />
      <Button type="submit">{props.label}</Button>
    </form>
  );
}
