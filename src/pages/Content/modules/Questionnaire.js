import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { Button } from 'react-bootstrap';
import { submitQuestionnaire }  from '..';

const Questionnaire = () => {
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [score3, setScore3] = useState(0);



    return (
        <div className="questionnaire">
            <h1>Questionnaire</h1>
            <div className="question-container">
                <h4 className="question">How reliable did you think the article was?</h4>
                <span className="spacing"></span>
                <StarRating updateScore={setScore1}/>
            </div>
            <div className="question-container">
                <h4 className="question">How biased was the author?</h4>
                <span className="spacing"></span>
                <StarRating updateScore ={setScore2}/>
            </div>
            <div className="question-container">
                <h4 className="question">What is your overall rating?</h4>
                <span className="spacing"></span>
                <StarRating updateScore={setScore3}/>
            </div>
            <div>
                <Button as="input" type="submit" value="Submit" onClick={() => submitQuestionnaire((score1 + score2+ score3)/3)}/>
            </div>
        </div>
    );
}

export default Questionnaire