import * as React from 'react';
import { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

const Component: React.FC<RouteComponentProps> = props => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [props.location.pathname]);
  return null;
};

export const ScrollToTop = withRouter(Component);
