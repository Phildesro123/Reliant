import React, { useEffect, useState } from 'react';
import authorImage from '../../assets/img/escobar.jpg';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import message from './modules/messenger';
import InputGroup from 'react-bootstrap/InputGroup';
import { getUserInfo, getURL } from '../Content/index';
import starRating from './modules/StarRating';
import HighlightPop from 'react-highlight-pop';
import axios from 'axios';
import './Popup.css';
import StarRating from './modules/StarRating';

const Popup = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [reliabilityScore, setReliabilityScore] = useState(null);
  useEffect(() => {
    getUserInfo().then((data) => setUserEmail(data.email));
    getURL().then((url) => {
      console.log(url);
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
            src={authorImage}
            rounded
          />
        </Col>
        <Col
          xs
          className="pr-0"
          style={{ paddingLeft: '10px', textAlign: 'left' }}
        >
          <h4 className="mb-0 mt-0">Pablo Escobar</h4>
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
              <Button block onClick={message}>
                Activate
              </Button>
            </Col>
          </Row>
        </Col>
        <HighlightPop>
        <div style={{ paddingTop: '10px', width: '100%', textAlign: 'center' }}>
          <h6 style={{ margin: '0px', fontSize: '10px' }}>
            Logged in as: {userEmail}
          </h6>
        </div>
        </HighlightPop>
      </Row>
    </Container>
  );
};

export default Popup;
