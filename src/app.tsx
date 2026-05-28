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
import { useSettings, store } from './store';
import { UserRouter } from './components/user/user-router';
import { useSettings } from './store/selector-hooks';

import { initializeSounds } from './services/sound';

// tslint:disable-next-line:no-import-side-effect
import 'inter-ui';
import { MetricsView } from './components/metrics';
import { WrappedIdleTimer } from './components/common/idle-timer';
import { ThemeProvider } from './bricks';

const Layout = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    startLoadingSettings(dispatch);
  }, [dispatch]);

  const settings = useSettings();
  const payment = settings.payment;
  initializeSounds(payment.deposit.sounds, payment.dispense.sounds);

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
      <Provider store={store}>
        <LocalizedIntlProvider>
          <HashRouter hashType="hashbang">
            <Layout />
          </HashRouter>
        </LocalizedIntlProvider>
      </Provider>
    </ThemeProvider>
  );
};

// tslint:disable-next-line:no-default-export
export default App;
