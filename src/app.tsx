import { injectGlobal } from 'emotion';
import * as React from 'react';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// tslint:disable-next-line:no-import-side-effect
import { baseCss, resetCss } from './components/ui/theme';
import { ConnectedUserDetails } from './components/user/user-details';
import { CreateUser } from './components/views/create-user';
import { ConnectedUser } from './components/views/user';
import { DefaultThunkAction, store } from './store';
import { startLoadingSettings } from './store/reducers/settings';

// tslint:disable-next-line:no-unused-expression
injectGlobal(resetCss);

injectGlobal(baseCss);

interface ActionProps {
  startLoadingSettings(): DefaultThunkAction;
}
class Layout extends React.Component<ActionProps> {
  public componentDidMount(): void {
    this.props.startLoadingSettings();
  }

  // tslint:disable-next-line:prefer-function-over-method
  public render(): JSX.Element {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Strichliste</h1>
        </header>
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

const mapDispatchToProps = {
  startLoadingSettings,
};

export const ConnectedLayout = connect(
  undefined,
  mapDispatchToProps
)(Layout);

class App extends React.Component {
  // tslint:disable-next-line:prefer-function-over-method
  public render(): JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ConnectedLayout />
        </BrowserRouter>
      </Provider>
    );
  }
}

// tslint:disable-next-line:no-default-export
export default App;
