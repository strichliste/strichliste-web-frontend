import { Theme } from 'bricks-of-sand';

export const baseCss = (theme: Theme) => `
:root{
  font-size: 18px;
}

label {
  display: block;
}

@media only screen and (min-width: ${theme.laptop}) {
  :root{
    font-size: 24px;
  }
}
body {
  font-family: 'Raleway', sans-serif;
  color: ${theme.font};
  background: ${theme.lightGrey};
}
h1,h2,h3{
  text-transform: uppercase;
  font-weight: lighter;
}
  a {
    text-decoration: none;
    color: ${theme.primary};
  }
  button,
  input {
    padding: 0.5rem;
    width: 100%;
    border-radius: 2px;
    border: 1px solid white;
  }
  input:focus {
    border-bottom: 1px solid ${theme.primary}
  }
  button:disabled {
    border: 1px solid ${theme.textSubtile}
  }
`;
