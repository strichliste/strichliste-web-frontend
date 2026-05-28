import * as React from 'react';
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { withRouter } from './routing';
import { queryClient } from './services/query-client';

import { ArticleRouter } from './components/article/article-router';
import { en } from './locales/en';
import { ErrorMessage } from './components/common/error-message';
import { HeaderMenu } from './components/common/header-menu';
import { FormattedMessage, IntlProvider, useIntl } from 'react-intl';
import { MainFooter } from './components/footer';
import { SearchResults } from './components/common/search-results';
import { SplitInvoiceForm } from './components/transaction';
import { UserRouter } from './components/user/user-router';
import { useSettings } from './queries';

// tslint:disable-next-line:no-import-side-effect
import 'inter-ui';
import { MetricsView } from './components/metrics';
import { WrappedIdleTimer } from './components/common/idle-timer';
import { ThemeProvider } from './bricks';

const RoutedSearchResults = withRouter(SearchResults);

// Keyboard/screen-reader users can jump past the header straight to content.
const SkipLink = () => (
  <a href="#main-content" className="skip-link">
    <FormattedMessage id="SKIP_TO_CONTENT" defaultMessage="Skip to content" />
  </a>
);

const ROUTE_TITLES: { test: RegExp; messageId: string; fallback: string }[] = [
  { test: /^\/user\/\d+/, messageId: 'ROUTE_TITLE_USER', fallback: 'User' },
  { test: /^\/user/, messageId: 'ROUTE_TITLE_USERS', fallback: 'Users' },
  { test: /^\/articles/, messageId: 'ROUTE_TITLE_ARTICLES', fallback: 'Articles' },
  { test: /^\/split-invoice/, messageId: 'SPLIT_INVOICE_HEADLINE', fallback: 'Split Invoice' },
  { test: /^\/metrics/, messageId: 'METRICS_HEADLINE', fallback: 'Metrics' },
  { test: /^\/search-results/, messageId: 'ROUTE_TITLE_SEARCH', fallback: 'Search' },
];

/**
 * Sets the localized document title for each route AND renders a
 * visually-hidden <h1> so every routed view has exactly one top-level heading
 * for screen-reader navigation (without disturbing the existing visual
 * hierarchy that starts at <h2>).
 */
const RouteTitle = () => {
  const { pathname } = useLocation();
  const intl = useIntl();
  const match = ROUTE_TITLES.find((entry) => entry.test.test(pathname));
  const title = match
    ? intl.formatMessage({ id: match.messageId, defaultMessage: match.fallback })
    : 'Strichliste';

  // `title` and `match` are derived from pathname (ROUTE_TITLES is module-level
  // constant), so pathname is the only authoritative input we want to react to.
  React.useEffect(() => {
    document.title = match ? `${title} · Strichliste` : 'Strichliste';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return <h1 className="sr-only">{title}</h1>;
};

const Layout = () => {
  return (
    <>
      <RouteTitle />
      <SkipLink />
      <ErrorMessage />
      <HeaderMenu />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/user/*" element={<UserRouter />} />
        <Route
          path="/articles/*"
          element={
            <>
              <WrappedIdleTimer />
              <ArticleRouter />
            </>
          }
        />
        <Route
          path="/split-invoice"
          element={
            <>
              <WrappedIdleTimer />
              <SplitInvoiceForm />
            </>
          }
        />
        <Route
          path="/metrics"
          element={
            <>
              <WrappedIdleTimer />
              <MetricsView />
            </>
          }
        />
        <Route
          path="/search-results"
          element={
            <>
              <WrappedIdleTimer />
              <RoutedSearchResults />
            </>
          }
        />
          <Route path="*" element={<Navigate to="/user/active" replace />} />
        </Routes>
      </main>
      <MainFooter />
    </>
  );
};

const LocalizedIntlProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { i18n } = useSettings();
  return (
    <IntlProvider
      textComponent={React.Fragment}
      locale={i18n.language}
      messages={en}
    >
      {children}
    </IntlProvider>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <LocalizedIntlProvider>
          <HashRouter>
            <Layout />
          </HashRouter>
        </LocalizedIntlProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

// tslint:disable-next-line:no-default-export
export default App;
