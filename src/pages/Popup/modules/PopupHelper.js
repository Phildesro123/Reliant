import message from './modules/messenger';
import InputGroup from 'react-bootstrap/InputGroup';
import { getUserInfo, getURL } from '../Content/index';
import starRating from './modules/StarRating';
import axios from 'axios';
import './Popup.css';
import StarRating from './modules/StarRating';

axios.get('https://test.wikipedia.org/w/api.php').then((response) => {
    console.log("made connection with wiki");    
    console.log(response.data);
    console.log(response.status);


});

  