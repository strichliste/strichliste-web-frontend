import * as React from 'react';

import { DayModeIcon } from './dayMode';
import { NightModeIcon } from './nightMode';

import './theme.css';

type Themes = 'light' | 'dark';

type ThemeContextType = {
  theme: Themes;
  toggleTheme(): void;
};
const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

const THEME_KEY = 'SELECTED_THEME';

//@ts-ignore
const getStoredTheme = (): Themes => localStorage.getItem(THEME_KEY) || 'light';
const setStoredTheme = (theme: Themes) =>
  localStorage.setItem(THEME_KEY, theme);

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = React.useState<Themes>(getStoredTheme());

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    setStoredTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeSwitcher: React.FC = props => {
  const { toggleTheme, theme } = React.useContext(ThemeContext);
  return (
    <button onClick={toggleTheme} {...props}>
      {theme === 'light' ? <DayModeIcon /> : <NightModeIcon />}
    </button>
  );
};
