/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';
import * as serviceWorker from './serviceWorker';

serviceWorker.register();
if (process.env.NODE_ENV !== 'production') {
  import('react-axe').then((axe) => {
    axe.default(React, ReactDOM, 1000);
    ReactDOM.render(<App />, document.getElementById('root'));
  });
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}
