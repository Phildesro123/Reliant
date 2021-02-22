import React from 'react'
import StarRating from './StarRating'
import {Button} from 'react-bootstrap'
const Questionnaire = () => {
    return (
        <div className="questionnaire">
            <h1>Questionnaire</h1>
            <div className="question-container">
                <h4 className="question">How reliable did you think the article was?</h4>
                <span className="spacing"></span>
                <StarRating></StarRating>
            </div>
            <div className="question-container">
                <h4 className="question">How biased was the author?</h4>
                <span className="spacing"></span>
                <StarRating></StarRating>
            </div>
            <div className="question-container">
                <h4 className="question">What is your overall rating?</h4>
                <span className="spacing"></span>
                <StarRating></StarRating>
            </div>
            <div>
                <Button as="input" type="submit" value="Submit"/>
            </div>
        </div>
    );
}

export default Questionnaire