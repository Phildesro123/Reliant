import axios from 'axios';
import './Popup.css';

axios.get('https://test.wikipedia.org/w/api.php').then((response) => {
    console.log("made connection with wiki");    
    console.log(response.data);
    console.log(response.status);


});

  