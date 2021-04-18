import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const userForm = () => {
    /**
     * https://react-bootstrap.github.io/components/forms/?
     */
    return (
    <Form>
    <Form.Group controlId="user-suggestedInfo" as="Test">
        <Form.Label>Know anything about the author? Leave some information for us to review!</Form.Label>
        <Form.Control as="textarea"/>
    </Form.Group>
    <Button type="submit">Submit suggestion</Button>
    </Form>)
}

export default userForm;