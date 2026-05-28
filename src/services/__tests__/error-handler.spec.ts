import { describe, expect, it } from 'vitest';
import { ApiError } from '../api';
import {
  pickErrorMessage,
  shortClass,
  throwOnBodyError,
} from '../error-handler';

describe('shortClass', () => {
  it('returns the last segment of a PHP-style FQCN', () => {
    expect(shortClass('App\\Foo\\UserAlreadyExistsException')).toBe(
      'UserAlreadyExistsException'
    );
  });

  it('returns the last segment of a dot-separated FQCN', () => {
    expect(shortClass('com.example.app.NotFound')).toBe('NotFound');
  });

  it('returns the input unchanged when it has no separators', () => {
    expect(shortClass('UserAlreadyExistsException')).toBe(
      'UserAlreadyExistsException'
    );
  });

  it('handles empty input gracefully', () => {
    expect(shortClass('')).toBe('');
  });
});

describe('pickErrorMessage', () => {
  const errors = {
    UserAlreadyExistsException: 'USER_EXISTS_MSG',
    'App\\Foo\\NetworkException': 'NETWORK_MSG',
  };

  it('matches the full FQCN exactly', () => {
    expect(
      pickErrorMessage('App\\Foo\\NetworkException', errors, 'DEFAULT')
    ).toBe('NETWORK_MSG');
  });

  it('falls back to the short class name', () => {
    expect(
      pickErrorMessage(
        'App\\Foo\\UserAlreadyExistsException',
        errors,
        'DEFAULT'
      )
    ).toBe('USER_EXISTS_MSG');
  });

  it('falls back to the default when no class matches', () => {
    expect(pickErrorMessage('App\\Foo\\UnknownClass', errors, 'DEFAULT')).toBe(
      'DEFAULT'
    );
  });

  it('returns the fallback when errorClass is undefined', () => {
    expect(pickErrorMessage(undefined, errors, 'DEFAULT')).toBe('DEFAULT');
  });

  it('returns the fallback when no error map is provided', () => {
    expect(pickErrorMessage('UserAlreadyExistsException', undefined, 'X')).toBe(
      'X'
    );
  });

  it('returns undefined when neither map nor fallback covers it', () => {
    expect(pickErrorMessage('Whatever', undefined, undefined)).toBeUndefined();
  });
});

describe('throwOnBodyError', () => {
  it('returns the data when no error.class is present', () => {
    const data: { user: { id: string; name: string }; error?: undefined } = {
      user: { id: '1', name: 'a' },
    };
    expect(throwOnBodyError(data)).toBe(data);
  });

  it('throws an ApiError carrying the errorClass when body declares one', () => {
    const data = { error: { class: 'App\\Foo\\UserAlreadyExistsException' } };
    expect(() => throwOnBodyError(data)).toThrowError(ApiError);
    try {
      throwOnBodyError(data);
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      const err = e as ApiError;
      expect(err.errorClass).toBe('App\\Foo\\UserAlreadyExistsException');
      expect(err.status).toBe(200);
      expect(err.body).toBe(data);
    }
  });
});
