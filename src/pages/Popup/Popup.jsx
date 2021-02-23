import React, { useState } from 'react';
import authorImage from '../../assets/img/escobar.jpg';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import message from './modules/messenger'
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import {getUserInfo} from "../Content/index"
import './Popup.css';

const getAuthor = () => {
  /* We must send a message to the content script and wait for response from it */
}




const Popup = () => {
  const [userInfo, setUserInfo] = useState(null)
  async () => {
    const userInfo = await getUserInfo();
    console.log("Popup User Info:", userInfo);
    setUserInfo(userInfo);
  }

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
                    <Button block onClick = {message}>Activate</Button>
                  </Col>
                </Row>
              </Col>
              <Row>
                <InputGroup size="sm" className="mb-2" style={{paddingLeft:"14px", paddingTop:"10px", paddingRight:"14px"}}>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">{userInfo.email}</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
                <InputGroup size="sm" className="mb-0" style={{paddingLeft:"14px", paddingRight:"14px"}}>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1"> Password</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
              </Row>
              <Row className="pr-0" style={{paddingLeft:"185px", paddingRight: "5px", paddingTop:"5px"}}>
                <Button variant="outline-success" size="sm" block>Login</Button>
              </Row>
            </Row>
            </Container>
  );
};

export default Popup;
