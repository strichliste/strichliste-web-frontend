import * as React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { StoreContext, useDispatch } from 'redux-react-hook';

import {
  Global,
  Theme,
  ThemeProvider,
  dark,
  light,
  resetCss,
  styled,
} from 'bricks-of-sand';
import { ArticleRouter } from './components/article/article-router';
import { en } from './locales/en';
import { ErrorMessage } from './components/common/error-message';
import { HeaderMenu } from './components/common/header-menu';
import { IntlProvider } from 'react-intl';
import { MainFooter, baseCss, mobileStyles } from './components/ui';
import { SearchResults } from './components/common/search-results';
import { SplitInvoiceForm } from './components/transaction';
import { startLoadingSettings } from './store/reducers';
import { store } from './store';
import { UserRouter } from './components/user/user-router';
import { useScalingState } from './components/settings/scaling-buttons';

// tslint:disable-next-line:no-import-side-effect
import 'inter-ui';
import { MetricsView } from './components/metrics';

const newLight: Theme = {
  ...light,
  greenLight: '#D4E8D3',
  greenText: '#6F9C7A',
};
const newDark: Theme = {
  ...dark,
  red: '#FFBAC2',
  green: '#C2FFCD',
  greenLight: 'rgba(36,200,65,0.20)',
  redLight: ' rgba(226,87,102,0.20)',
};

const Grid = styled('div')({
  display: 'grid',
  gridTemplateRows: '4rem 1fr 4rem',
  minHeight: '100vh',
});

const TouchStyles = () => {
  const isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;
  if (isTouchDevice) {
    return <Global styles={mobileStyles} />;
  }
  return null;
};

const Layout = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    startLoadingSettings(dispatch);
  }, [dispatch]);

  const { scaling } = useScalingState();

  return (
    <Grid>
      <Global styles={resetCss} />
      <Global styles={baseCss(scaling)} />
      <TouchStyles />
      <ErrorMessage />
      <HeaderMenu />
      <Switch>
        <Route path="/user" component={UserRouter} />
        <Route path="/articles" component={ArticleRouter} />
        <Route path="/split-invoice" component={SplitInvoiceForm} />
        <Route path="/metrics" component={MetricsView} />
        <Route path="/search-results" component={SearchResults} />
        <Redirect from="/" to="/user/active" />
      </Switch>
      <MainFooter />
    </Grid>
  );
};

class App extends React.Component {
  // tslint:disable-next-line:prefer-function-over-method
  public render(): JSX.Element {
    return (
      <ThemeProvider themes={{ light: newLight, dark: newDark }}>
        <StoreContext.Provider value={store}>
          <IntlProvider
            textComponent={React.Fragment}
            locale="en"
            messages={en}
          >
            <HashRouter hashType="hashbang">
              <Layout />
            </HashRouter>
          </IntlProvider>
        </StoreContext.Provider>
      </ThemeProvider>
    );
  }
}

// tslint:disable-next-line:no-default-export
export default App;
