export const theme = {
  white: 'white',
  black: '#1F1F1F',
  grey: '#CDCDCD',
  lightGrey: '#f2f3f2',
  font: '#888',
  border: '#cdcdcd',
  primary: '#64a4bd',
  primaryDark: 'pink',
  red: '#B67138',
  green: '#708F63',
  pc: '90rem',
  laptop: '75rem',
  tablet: '48rem',
  mobile: '30rem',
};

export const breakPoints = {
  laptop: `@media(min-width: ${theme.laptop})`,
  tablet: `@media(min-width: ${theme.tablet})`,
  mobile: `@media(min-width: ${theme.mobile})`,
};

export const shadows = {
  inset: 'inset 0 2px 2px 0 rgba(0,0,0,.14)',
  level1: '0 0 1px rgba(0, 0, 0, 0)',
  level2:
    '0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)',
  level3:
    '0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0,0,0,.2),0 1px 8px 0 rgba(0,0,0,.12)',
  level4:
    '0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2)',
  level5:
    '0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2)',
  level6:
    '0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12),0 5px 5px -3px rgba(0,0,0,.2)',
};

export const resetCss = `button,input[type=reset],input[type=button],input[type=submit],input[type=button],input[type=reset],input[type=submit]{overflow:visible;width:auto}blockquote,body,dd,dl,dt,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,html,iframe,legend,li,ol,p,pre,textarea,ul{margin:0;padding:0}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:400}ul{list-style:none}button,input,select,textarea{margin:0}html{box-sizing:border-box}*,:after,:before{box-sizing:inherit}audio,embed,iframe,img,object,video{height:auto;max-width:100%}iframe{border:0}table{border-collapse:collapse;border-spacing:0}td,th{padding:0;text-align:left}select[multiple]{vertical-align:top}*{box-sizing:border-box}button,input,label,select,textarea{margin:0;border:0;padding:0;display:inline-block;vertical-align:middle;white-space:normal;background:0 0;line-height:1;font-size:1rem;font-family:Arial}select[multiple],textarea{vertical-align:top}input:focus{outline:0}button,input[type=button],input[type=checkbox],input[type=radio],input[type=reset],input[type=submit],select{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}input[type=checkbox],input[type=radio]{width:1rem;height:1rem}input[type=search]{-webkit-appearance:textfield;-webkit-box-sizing:content-box}::-webkit-search-decoration{display:none}::-webkit-file-upload-button{padding:0;border:0;background:0 0}textarea{overflow:auto}`;
export const baseCss = `
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
    color: ${theme.black};
  }
  button,
  input {
    padding: 0.5rem;
    width: 100%;
    border-radius: 2px;
    border: 1px solid ${theme.border};
  }
`;
