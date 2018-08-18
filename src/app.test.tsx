import * as React from 'react';
import * as ReactDOM from 'react-dom';
// tslint:disable-next-line:file-name-casing
import App from './app';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
