export const baseCss = `
:root{
  font-size: 14px;
}

label {
  display: block;
}

@media only screen and (min-width: 40em) {
  :root{
    font-size: 16px;
  }
}

@media only screen and (min-width: 100em) {
  :root{
    font-size: 22px;
  }
}

@media only screen and (min-width: 130em) {
  :root{
    font-size: 28px;
  }
}

body {
  font-family: 'Inter UI';
}
h1,h2,h3{
  text-transform: uppercase;
  font-family: 'Inter UI';
  font-weight: lighter;
}
  input {
    padding: 0.5rem;
    font-family: 'Inter UI';
    width: 100%;
    border-radius: 2px;
  }
  input,button {
    align-items: center;
    align-content:center;
  }
`;
