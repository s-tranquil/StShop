import * as React from "react";

import "bootstrap/dist/css/bootstrap.css";

import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { App } from "./layout";
import registerServiceWorker from "./registerServiceWorker";

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
  <BrowserRouter basename={baseUrl as string}>
    <App />
  </BrowserRouter>,
  rootElement);

registerServiceWorker();

