import { injectGlobal } from 'emotion';
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// tslint:disable-next-line:no-import-side-effect
import { FormattedMessage, IntlProvider } from 'react-intl';
import { ConnectedSettingsLoader } from './components/settings';
import { Header, baseCss, resetCss } from './components/ui';
import { ConnectedUserDetails } from './components/user/user-details';
import { CreateUser } from './components/views/create-user';
import { ConnectedUser } from './components/views/user';
import { en } from './locales/en';
import { store } from './store';

// inject global non scoped css stylings
// tslint:disable-next-line:no-unused-expression
injectGlobal(resetCss);
injectGlobal(baseCss);

class Layout extends React.Component {
  // tslint:disable-next-line:prefer-function-over-method
  public render(): JSX.Element {
    return (
      <div className="App">
        <Header>
          <h1>
            <FormattedMessage id="TALLY_HEADER" />
          </h1>
        </Header>
        <ConnectedSettingsLoader />
        <Switch>
          <Route path="/" exact={true} component={ConnectedUser} />
          <Route path="/createUser" exact={true} component={CreateUser} />
          <Route
            path="/user/:id"
            exact={true}
            component={ConnectedUserDetails}
          />
        </Switch>
      </div>
    );
  }
}

class App extends React.Component {
  // tslint:disable-next-line:prefer-function-over-method
  public render(): JSX.Element {
    return (
      <Provider store={store}>
        <IntlProvider locale="en" messages={en}>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </IntlProvider>
      </Provider>
    );
  }
}

// tslint:disable-next-line:no-default-export
export default App;
