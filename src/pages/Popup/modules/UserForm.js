import React, { useEffect, useRef, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { getSuggestedInfo, submitSuggestion } from '../../../API/APIModule';



const userForm = () => {
    const [submitted, setSubmitted] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [url, setURL] = useState(null);
    const input = useRef(null);
    const TextArea = () => { return ( <Form.Control as="textarea" placeholder="Type here" style={{resize: "none"}} ref={input}/>); }

     const handleClick = (e) => {
        e.preventDefault();
        submitSuggestion(userInfo.id, url, input.current.value);
        setSubmitted(true);
    }
    useEffect(()=> {
        chrome.runtime.sendMessage('userInfo', (res) => {
            console.log(res)
            setUserInfo(res);
          });
          chrome.runtime.sendMessage('activeURL', (res) => {
              setURL(res);
          });
          if (userInfo && url)
          getSuggestedInfo(userInfo.id, url).then((data) => {
            console.log("Data", data)
        });
      


    },[])
    return (
    <Form id="userform">
    <Form.Group controlId="user-suggestedInfo">
        <Form.Label>{submitted ? "We're reviewing your submission" : "Know anything about the author? Leave some information for us to review!"}</Form.Label>
        {submitted ? null : <TextArea/>}
        {submitted ? <span>Thank you for your contribution!</span>: <Button type="submit" onClick={handleClick} disabled={submitted}>Submit suggestion</Button>}

    </Form.Group>
    </Form>)
}

export default userForm;