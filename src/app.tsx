import * as React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import { ThemeProvider, injectGlobal, resetCss, theme } from 'bricks-of-sand';
import { IntlProvider } from 'react-intl';
import { ArticleRouter } from './components/article/article-router';
import { ConnectedErrorMessage } from './components/common/error-message';
import { HeaderMenu } from './components/common/header-menu';
import { ConnectedSettingsLoader } from './components/settings';
import { MainFooter, baseCss } from './components/ui';
import { GlobalLoadingIndicator } from './components/ui/loader';
import { UserRouter } from './components/user/user-router';
import { en } from './locales/en';
import { store } from './store';

theme.primary = '#343434';
theme.red = '#E25766';
theme.green = '#71EA73';
theme.grey = '#badada';
theme.lightGrey = '#F5F5F5';
theme.textSubtile = '#5B687B';
theme.borderRadius = '8px';

// inject global non scoped css stylings
// tslint:disable-next-line:no-unused-expression
injectGlobal(resetCss);
injectGlobal(baseCss(theme));

class Layout extends React.Component {
  // tslint:disable-next-line:prefer-function-over-method
  public render(): JSX.Element {
    return (
      <>
        <GlobalLoadingIndicator />
        <ConnectedErrorMessage />
        <ConnectedSettingsLoader />
        <HeaderMenu />
        <Switch>
          <Route path="/articles" component={ArticleRouter} />
          <Route path="/user" component={UserRouter} />
          <Redirect from="/" to="/user/active" />
        </Switch>
        <MainFooter />
      </>
    );
  }
}

class App extends React.Component {
  // tslint:disable-next-line:prefer-function-over-method
  public render(): JSX.Element {
    return (
      <ThemeProvider theme={theme}>
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
    );
  }
}

// tslint:disable-next-line:no-default-export
export default App;
