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
import { FormattedMessage, IntlProvider } from 'react-intl';
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

const ROUTE_TITLES: { test: RegExp; title: string }[] = [
  { test: /^\/user\/\d+/, title: 'User' },
  { test: /^\/user/, title: 'Users' },
  { test: /^\/articles/, title: 'Articles' },
  { test: /^\/split-invoice/, title: 'Split Invoice' },
  { test: /^\/metrics/, title: 'Metrics' },
  { test: /^\/search-results/, title: 'Search' },
];

// Give each route a distinct, announced document title.
const RouteTitle = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    const match = ROUTE_TITLES.find((entry) => entry.test.test(pathname));
    document.title = match ? `${match.title} · Strichliste` : 'Strichliste';
  }, [pathname]);
  return null;
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
