import React, { Suspense } from 'react';

const LazyMetrics = React.lazy(() => import('./metrics'));

export const UserMetricsView = () => {
  return (
    <Suspense fallback="...">
      <LazyMetrics />
    </Suspense>
  );
};
