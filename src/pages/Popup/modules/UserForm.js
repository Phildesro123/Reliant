import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
const TextArea = () => { return ( <Form.Control as="textarea" placeholder="Type here"/>); }



const userForm = () => {
    const [submitted, setSubmitted] = useState(false);
    /**
     * https://react-bootstrap.github.io/components/forms/?
     */
     const handleClick = (e) => {
        e.preventDefault();
        setSubmitted(true);
        console.log("I got pressed")
    }
    useEffect(()=> {
        if (submitted) {
            console.log("Submitted the form")
            document.getElementById('userform').remove()
        }
    })
    return (
    <Form id="userform">
    <Form.Group controlId="user-suggestedInfo">
        <Form.Label>Know anything about the author? Leave some information for us to review!</Form.Label>
        <TextArea/>
    </Form.Group>
    <Button variant="primary" type="submit" onClick={handleClick}>Submit suggestion</Button>
    </Form>)
}

export default userForm;