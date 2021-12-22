import { cleanup, render, screen } from '../../render';
import React from 'react';
import { afterEach, describe, expect, test } from 'vitest';
import { Button } from './button';

afterEach(cleanup);
describe('button', () => {
  test('should render', () => {
    const label = 'test';
    render(<Button>{label}</Button>);
    expect(screen.getByRole('button', { name: label })).toBeDefined();
  });
});
