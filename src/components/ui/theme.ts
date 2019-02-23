export const baseCss = (scaling: number) => `
:root{
  font-size: ${15 + scaling}px;
}

label {
  display: block;
}

@media only screen and (min-width: 40em) {
  :root{
    font-size: ${17 + scaling}px;
  }
}

@media only screen and (min-width: 100em) {
  :root{
    font-size: ${22 + scaling}px;
  }
}

body {
  font-family: 'Inter';
}
h1,h2,h3{
  text-transform: uppercase;
  font-family: 'Inter';
  font-weight: lighter;
}
  input {
    padding: 0.5rem;
    font-family: 'Inter';
    width: 100%;
    border-radius: 2px;
  }
  input,button {
    align-items: center;
    align-content:center;
  }
`;

export const mobileStyles = `
  body { user-select: none;}
`;
