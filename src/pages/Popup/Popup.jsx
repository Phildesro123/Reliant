import React from 'react';
import authorImage from '../../assets/img/escobar.jpg';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Popup.css';

const Popup = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Container>
          <Row>
            <Col xs={6} md={4}>
              <Image src={authorImage} roundedCircle fluid />
            </Col>
            <Col xs={6} md={4}>
              <Badge variant="secondary">New</Badge>
            </Col>
          </Row>
        </Container>
      </header>
    </div>
  );
};

export default Popup;
