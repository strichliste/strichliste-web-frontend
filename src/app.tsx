import { injectGlobal } from 'emotion';
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// tslint:disable-next-line:no-import-side-effect
import { ConnectedSettingsLoader } from './components/settings';
import { baseCss, resetCss } from './components/ui/theme';
import { ConnectedUserDetails } from './components/user/user-details';
import { CreateUser } from './components/views/create-user';
import { ConnectedUser } from './components/views/user';
import { store } from './store';

// tslint:disable-next-line:no-unused-expression
injectGlobal(resetCss);

injectGlobal(baseCss);

class Layout extends React.Component {
  // tslint:disable-next-line:prefer-function-over-method
  public render(): JSX.Element {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Strichliste</h1>
        </header>
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
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </Provider>
    );
  }
}

// tslint:disable-next-line:no-default-export
export default App;
