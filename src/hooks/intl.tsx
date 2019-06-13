import * as React from 'react';
import { useContext } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

export const IntlContext = React.createContext<InjectedIntl>(
  // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
  {} as InjectedIntl
);

export const InjectIntlContext = injectIntl(({ intl, children }) => (
  <IntlContext.Provider value={intl}>{children}</IntlContext.Provider>
));

export const useFormatMessage = () => {
  const intl = useContext(IntlContext);
  return intl.formatMessage;
};
