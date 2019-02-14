import React, { Suspense } from 'react';

// @ts-ignore
const LazyMetrics = React.lazy(() => import('./metrics'));

export const UserMetricsView = () => {
  return (
    <Suspense fallback="...">
      <LazyMetrics />
    </Suspense>
  );
};
