import React from 'react';
import { render } from 'react-dom';

//const domNode = document.getElementById('root');
//const root = createRoot(domNode);

import Options from './Options';
import './index.css';

render(
  <Options title={'settings'} />,
  window.document.querySelector('#app-container')
);
