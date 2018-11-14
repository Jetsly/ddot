import * as React from 'react';
import { render } from 'react-dom';
import './global';
import App from './pages/index';
const root = document.createElement('div');
document.body.appendChild(root);
render(
  <div>
    <App />
    sss
  </div>,
  root
);
