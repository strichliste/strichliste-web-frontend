export const baseCss = `
:root{
  font-size: 16px;
}

label {
  display: block;
}

@media only screen and (min-width: 30em) {
  :root{
    font-size: 20px;
  }
}
body {
  overflow: scroll;
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
