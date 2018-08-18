import { injectGlobal } from 'emotion';
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// tslint:disable-next-line:no-import-side-effect
import { ConnectedUserDetails } from './components/user/user-details';
import { CreateUser } from './components/views/create-user';
import { ConnectedUser } from './components/views/user';
import { store } from './store';

// tslint:disable-next-line:no-unused-expression
injectGlobal`html,
body,
p,
ol,
ul,
li,
dl,
dt,
dd,
blockquote,
figure,
fieldset,
legend,
textarea,
pre,
iframe,
hr,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  padding: 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: 100%;
  font-weight: normal;
}

ul {
  list-style: none;
}

button,
input,
select,
textarea {
  margin: 0;
}

html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

img,
embed,
iframe,
object,
audio,
video {
  height: auto;
  max-width: 100%;
}

iframe {
  border: 0;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

td,
th {
  padding: 0;
  text-align: left;
}

input,
label,
select,
button,
textarea
{
	margin:0;
	border:0;
	padding:0;
	display:inline-block;
	vertical-align:middle;
	white-space:normal;
	background:none;
	line-height:1;
	/* Browsers have different default form fonts */
	font-size:13px;
	font-family:Arial;
}

/* Remove the stupid outer glow in Webkit */
input:focus
{
	outline:0;
}

/* Box Sizing Reset
-----------------------------------------------*/

/* All of our custom controls should be what we expect them to be */
input,
textarea
{
	-webkit-box-sizing:content-box;
	-moz-box-sizing:content-box;
	box-sizing:content-box;
}

/* These elements are usually rendered a certain way by the browser */
button,
input[type=reset],
input[type=button],
input[type=submit],
input[type=checkbox],
input[type=radio],
select
{
	-webkit-box-sizing:border-box;
	-moz-box-sizing:border-box;
	box-sizing:border-box;
}

/* Text Inputs
-----------------------------------------------*/

input[type=date],
input[type=datetime],
input[type=datetime-local],
input[type=email],
input[type=month],
input[type=number],
input[type=password],
input[type=range],
input[type=search],
input[type=tel],
input[type=text],
input[type=time],
input[type=url],
input[type=week]
{
}

/* Button Controls
-----------------------------------------------*/

input[type=checkbox],
input[type=radio]
{
	width:13px;
	height:13px;
}

/* File Uploads
-----------------------------------------------*/

input[type=file]
{

}

/* Search Input
-----------------------------------------------*/

/* Make webkit render the search input like a normal text field */
input[type=search]
{
	-webkit-appearance:textfield;
	-webkit-box-sizing:content-box;
}

/* Turn off the recent search for webkit. It adds about 15px padding on the left */
::-webkit-search-decoration
{
	display:none;
}

/* Buttons
-----------------------------------------------*/

button,
input[type="reset"],
input[type="button"],
input[type="submit"]
{
	/* Fix IE7 display bug */
	overflow:visible;
	width:auto;
}

/* IE8 and FF freak out if this rule is within another selector */
::-webkit-file-upload-button
{
	padding:0;
	border:0;
	background:none;
}

/* Textarea
-----------------------------------------------*/

textarea
{
	/* Move the label to the top */
	vertical-align:top;
	/* Turn off scroll bars in IE unless needed */
	overflow:auto;
}

/* Selects
-----------------------------------------------*/

select
{

}

select[multiple]
{
	/* Move the label to the top */
	vertical-align:top;
}
* {box-sizing: border-box;}
button,input,label,select,textarea{margin:0;border:0;padding:0;display:inline-block;vertical-align:middle;white-space:normal;background:0 0;line-height:1;font-size:13px;font-family:Arial}select[multiple],textarea{vertical-align:top}input:focus{outline:0}input,textarea{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}button,input[type=button],input[type=checkbox],input[type=radio],input[type=reset],input[type=submit],select{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}input[type=checkbox],input[type=radio]{width:13px;height:13px}input[type=search]{-webkit-appearance:textfield;-webkit-box-sizing:content-box}::-webkit-search-decoration{display:none}button,input[type=reset],input[type=button],input[type=submit]{overflow:visible;width:auto}::-webkit-file-upload-button{padding:0;border:0;background:0 0}textarea{overflow:auto}
`;

class App extends React.Component {
  // tslint:disable-next-line:prefer-function-over-method
  public render(): JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </Provider>
    );
  }
}

// tslint:disable-next-line:no-default-export
export default App;

function Layout(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Strichliste</h1>
      </header>
      <Switch>
        <Route path="/" exact={true} component={ConnectedUser} />
        <Route path="/createUser" exact={true} component={CreateUser} />
        <Route path="/user/:id" exact={true} component={ConnectedUserDetails} />
      </Switch>
    </div>
  );
}
