import React, { useEffect, useState } from 'react';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import message from './modules/messenger';
import axios from 'axios';
import './Popup.css';
import StarRating from './modules/StarRating';

const Popup = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [reliabilityScore, setReliabilityScore] = useState(null);
  const [authors, setAuthors] = useState(null);
  const [activated, setActivated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    message("getAuthors").then((authors) => {
      setAuthors(authors);
      console.log("From popup", authors);
    })
    chrome.runtime.sendMessage('userInfo', (userInfo) => {
      setUserEmail(userInfo.email)
    });
    chrome.runtime.sendMessage('activeURL', (url) => {
      axios
        .get('http://localhost:4000/api/websites/getSiteData', {
          params: {
            _id: url,
          },
        })
        .then((response) => {
          if ("reliabilityScore" in response.data) {
            setReliabilityScore(response.data.reliabilityScore);
          } else {
            setReliabilityScore(null);
          }
        })
        .catch((error) => {
          console.log("WE ARE IN ERROR")
          setReliabilityScore(null);
        });
    });
  }, []);
  return (
    <Container style={{ width: '400px', padding: '10px', textAlign: 'center' }}>
      <Row className="m-0">
        <Col xs="auto" className="pl-0 pr-0">
          <Image
            style={{ width: '150px', height: '150px' }}
            src={"https://i0.wp.com/celikkol.net/wp-content/uploads/2016/03/Author-Icon.png?zoom=2&fit=1024%2C1024&ssl=1"}
            rounded
          />
        </Col>
        <Col
          xs
          className="pr-0"
          style={{ paddingLeft: '10px', textAlign: 'left' }}
        >
          <h4 className="mb-0 mt-0">{authors ? authors[0]: "Author Name"}</h4>
          <span>Senior Journalist</span>
          <div className="reliability-container">
            <h6>Reliability Score:</h6>
            <div className="star-reliability-container">
              <StarRating rating={reliabilityScore} />
              <span className="rating">
                {reliabilityScore === null
                  ? 0
                  : Math.round(reliabilityScore * 10) / 10}
              </span>
            </div>
          </div>
          <Row className="m-0" style={{ paddingTop: '10px' }}>
            <Col className="pl-0" style={{ paddingRight: '5px' }}>
              <Button variant="outline-primary" block>
                Comment
              </Button>
            </Col>
            <Col className="pr-0" style={{ paddingLeft: '5px' }}>
              <Button block 
              onClick={() => {
                if (activated) {
                  message("deactivate")
                  setActivated(false)
                } else {
                  message("activate")
                  setActivated(true)
                }}}>
                {activated ? "Deactivate" : "Activate"} 
              </Button>
            </Col>
          </Row>
        </Col>
        <div style={{ paddingTop: '10px', width: '100%', textAlign: 'center' }}>
          <h6 style={{ margin: '0px', fontSize: '10px' }}>
            Logged in as: {userEmail}
          </h6>
        </div>
      </Row>
    </Container>
  );
};

export default Popup;
