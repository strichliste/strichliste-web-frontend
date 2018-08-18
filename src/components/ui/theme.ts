export const theme = {
  white: 'white',
  grey: '#cdcdcd',
  lightGrey: '#eee',
  font: '#888',
  border: '#cdcdcd',
  primary: '#509FBF',
  primaryDark: 'pink',
  red: 'red',
  green: 'green',
};

export const resetCss = `button,input[type=reset],input[type=button],input[type=submit],input[type=button],input[type=reset],input[type=submit]{overflow:visible;width:auto}blockquote,body,dd,dl,dt,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,html,iframe,legend,li,ol,p,pre,textarea,ul{margin:0;padding:0}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:400}ul{list-style:none}button,input,select,textarea{margin:0}html{box-sizing:border-box}*,:after,:before{box-sizing:inherit}audio,embed,iframe,img,object,video{height:auto;max-width:100%}iframe{border:0}table{border-collapse:collapse;border-spacing:0}td,th{padding:0;text-align:left}select[multiple]{vertical-align:top}*{box-sizing:border-box}button,input,label,select,textarea{margin:0;border:0;padding:0;display:inline-block;vertical-align:middle;white-space:normal;background:0 0;line-height:1;font-size:13px;font-family:Arial}select[multiple],textarea{vertical-align:top}input:focus{outline:0}button,input[type=button],input[type=checkbox],input[type=radio],input[type=reset],input[type=submit],select{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}input[type=checkbox],input[type=radio]{width:13px;height:13px}input[type=search]{-webkit-appearance:textfield;-webkit-box-sizing:content-box}::-webkit-search-decoration{display:none}::-webkit-file-upload-button{padding:0;border:0;background:0 0}textarea{overflow:auto}`;
export const baseCss = `
:root{
  font-size: 24px;
}
body {
  font-family: 'Raleway', sans-serif;
  background: ${theme.lightGrey}
}
  a {
    text-decoration: none;
    color: ${theme.primary}
  }
  button,
  input {
    padding: 0.5rem;
    width: 100%;
    border-radius: 2px;
    border: 1px solid ${theme.border};
  }
`;
