import * as React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';

import { ArticleRouter } from './components/article/article-router';
import { en } from './locales/en';
import { ErrorMessage } from './components/common/error-message';
import { HeaderMenu } from './components/common/header-menu';
import { IntlProvider } from 'react-intl';
import { MainFooter } from './components/footer';
import { SearchResults } from './components/common/search-results';
import { SplitInvoiceForm } from './components/transaction';
import { startLoadingSettings } from './store/reducers';
import { store } from './store';
import { UserRouter } from './components/user/user-router';

// tslint:disable-next-line:no-import-side-effect
import 'inter-ui';
import { MetricsView } from './components/metrics';
import { WrappedIdleTimer } from './components/common/idle-timer';
import { ThemeProvider } from './bricks';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './services/api';

const Layout = () => {
  return (
    <>
      <ErrorMessage />
      <HeaderMenu />
      <Switch>
        <Route path="/user" component={UserRouter} />
        <Route
          path="/articles"
          render={() => (
            <>
              <WrappedIdleTimer />
              <ArticleRouter />
            </>
          )}
        />
        <Route
          path="/split-invoice"
          render={() => (
            <>
              <WrappedIdleTimer />
              <SplitInvoiceForm />
            </>
          )}
        />
        <Route
          path="/metrics"
          render={() => (
            <>
              <WrappedIdleTimer />
              <MetricsView />
            </>
          )}
        />
        <Route
          path="/search-results"
          render={(props) => (
            <>
              <WrappedIdleTimer />
              <SearchResults {...props} />
            </>
          )}
        />
        <Redirect from="/" to="/user/active" />
      </Switch>
      <MainFooter />
    </>
  );
};

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Provider store={store}>
          <IntlProvider
            textComponent={React.Fragment}
            locale="en"
            messages={en}
          >
            <HashRouter hashType="hashbang">
              <Layout />
            </HashRouter>
          </IntlProvider>
        </Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// tslint:disable-next-line:no-default-export
export default App;
