import React from 'react';
import authorImage from '../../assets/img/escobar.jpg';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './Popup.css';

const Popup = () => {
  return (
          <Container style={{width: '400px', padding:"10px",  textAlign:"center"}}>
            <Row className='m-0'>
              <Col xs="auto" className="pl-0 pr-0">
                <Image style={{width:"150px", height:"150px"}} src={authorImage} rounded  />
              </Col>
              <Col xs className="pr-0" style={{paddingLeft:"10px", textAlign:"left"}}>
                <h4 className="mb-0 mt-0">Pablo Escobar</h4><span>Senior Journalist</span>
                <Row className="w-100 m-0 justify-content-between d-flex rounded" style={{backgroundColor:"#f2f5f8", paddingLeft:"10px"}}>
                  <Col xs={3} className="p-0">
                    <span className="stat-header">Articles</span> <span className="stat">35</span>
                  </Col>
                  <Col xs={3} className="p-0">
                    <span className="stat-header">Followers</span> <span className="stat">900</span>
                  </Col>
                  <Col xs={3} className="p-0">
                    <span className="stat-header">Rating</span> <span className="stat">3.2</span>
                  </Col>
                </Row>
                <Row className="m-0" style={{paddingTop:"10px"}}>
                  <Col className="pl-0" style={{paddingRight: "5px"}}>
                    <Button variant="outline-primary" block>Comment</Button>
                  </Col>
                  <Col className="pr-0" style={{paddingLeft: "5px"}}>
                    <Button block >More</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            </Container>
  );
};

export default Popup;
