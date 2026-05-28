import { MutationObserver, QueryObserver } from '@tanstack/react-query';
import { beforeEach, describe, expect, it } from 'vitest';
import { ApiError } from '../api';
import { getGlobalError, setGlobalError } from '../global-error';
import { queryClient } from '../query-client';

/**
 * The shared queryClient mounts a QueryCache.onError and MutationCache.onError
 * that surface read/write failures through the global toast. These tests
 * verify both ends in isolation.
 */

function flush(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('queryClient.queryCache.onError', () => {
  beforeEach(() => {
    setGlobalError('');
    queryClient.clear();
  });

  it('routes meta.defaultError to setGlobalError on a query failure', async () => {
    const observer = new QueryObserver(queryClient, {
      queryKey: ['test-q', 'fail'],
      queryFn: () => Promise.reject(new Error('boom')),
      meta: { defaultError: 'TEST_QUERY_DEFAULT' },
      retry: false,
      gcTime: 0,
    });
    const unsub = observer.subscribe(() => {});
    observer.refetch().catch(() => {});
    await flush();
    await flush();
    unsub();
    expect(getGlobalError()).toBe('TEST_QUERY_DEFAULT');
  });
});

describe('queryClient.mutationCache.onError', () => {
  beforeEach(() => {
    setGlobalError('');
  });

  it('routes meta.errors[FQCN-short-class] on ApiError with errorClass', async () => {
    const observer = new MutationObserver(queryClient, {
      mutationFn: async () => {
        throw new ApiError(
          200,
          '',
          { error: { class: 'App\\Foo\\UserAlreadyExistsException' } },
          undefined,
          'App\\Foo\\UserAlreadyExistsException'
        );
      },
      meta: {
        defaultError: 'GENERIC',
        errors: { UserAlreadyExistsException: 'USER_EXISTS' },
      },
      retry: false,
    });
    await observer.mutate(undefined).catch(() => {});
    await flush();
    expect(getGlobalError()).toBe('USER_EXISTS');
  });

  it('falls back to meta.defaultError when no class map hits', async () => {
    const observer = new MutationObserver(queryClient, {
      mutationFn: async () => {
        throw new ApiError(500, 'Internal Server Error', null);
      },
      meta: { defaultError: 'GENERIC_FAILURE' },
      retry: false,
    });
    await observer.mutate(undefined).catch(() => {});
    await flush();
    expect(getGlobalError()).toBe('GENERIC_FAILURE');
  });

  it('is a no-op when the mutation has no meta', async () => {
    setGlobalError('PRESERVED');
    const observer = new MutationObserver(queryClient, {
      mutationFn: async () => {
        throw new Error('boom');
      },
      retry: false,
    });
    await observer.mutate(undefined).catch(() => {});
    await flush();
    expect(getGlobalError()).toBe('PRESERVED');
  });
});
