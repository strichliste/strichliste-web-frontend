import { Theme } from 'bricks-of-sand';

export const baseCss = (theme: Theme) => `
:root{
  font-size: 16px;
}

label {
  display: block;
}

@media only screen and (min-width: ${theme.laptop}) {
  :root{
    font-size: 20px;
  }
}
body {
  font-family: 'Raleway', sans-serif;
  color: ${theme.font};
}
h1,h2,h3{
  text-transform: uppercase;
  font-weight: lighter;
}
  input {
    padding: 0.5rem;
    width: 100%;
    border-radius: 2px;
  }
`;
