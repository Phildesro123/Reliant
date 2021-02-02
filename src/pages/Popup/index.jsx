import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

render(<Popup />, window.document.querySelector('#app-container'));
