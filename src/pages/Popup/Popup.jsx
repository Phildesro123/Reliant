import React, {useEffect, useState } from 'react';
import authorImage from '../../assets/img/escobar.jpg';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import message from './modules/messenger'
import InputGroup from "react-bootstrap/InputGroup";
import {getUserInfo, getURL} from "../Content/index"
import axios from "axios"
import './Popup.css';

const Popup = () => {
  const [userEmail, setUserEmail] = useState(null)
  const [reliabilityScore, setReliabilityScore] = useState(null)
  useEffect(() => {
    getUserInfo().then(data => setUserEmail(data.email));
    getURL().then(url => {
      console.log(url)
      axios.get('http://localhost:4000/api/websites/getSiteData', {
        _id: url
      }).then((response) => {
        setReliabilityScore(response.data.reliabilityScore)
      }).catch((error) => {
        setReliabilityScore("N/A")
      })
    })
  }, []);

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
                    <span className="stat-header">Rating</span> <span className="stat">{reliabilityScore}</span>
                  </Col>
                </Row>
                <Row className="m-0" style={{paddingTop:"10px"}}>
                  <Col className="pl-0" style={{paddingRight: "5px"}}>
                    <Button variant="outline-primary" block>Comment</Button>
                  </Col>
                  <Col className="pr-0" style={{paddingLeft: "5px"}}>
                    <Button block onClick = {message}>Activate</Button>
                  </Col>
                </Row>
              </Col>
              <div style={{paddingTop:"10px", width:"100%", textAlign:"center"}}>
                <h6 style={{margin:"0px", fontSize:"10px"}}>Logged in as: {userEmail}</h6>
              </div>
            </Row>
            </Container>
  );
};

export default Popup;
