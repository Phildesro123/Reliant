import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { Button } from 'react-bootstrap';
import { submitQuestionnaire } from '..';
import axios from 'axios';

const Questionnaire = () => {
  const genre = 'Tech';
  async function submitClicked() {
    //start loading animation here (waiting for response)
    //response is shows whether or not saving the data succeeded
    return new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await submitQuestionnaire((score1 + score2 + score3) / 3);
    console.log(response);
    //stop loading animation
    //if response is true show green checkmark
    //if response if false show error
  }
  const SUBMIT = 'Submit';
  const SUBMITTING = 'Submitting...';
  const SUBMITTED = 'Questionnaire submitted';
  const [scores, setScores] = useState({});
  0;
  //   {questionId: 5,
  //   questionId: 3}
  const [questions, setQuestions] = useState([]);
  const [submitState, setSubmitState] = useState(SUBMIT);

  //realgenre is only one genre

  //useEffect to get a list of questions and for each question create the html for it
  //create an dictionary of scores associated with the questions and connect these to the stars
  //send dictionary to submitQuestionnaire
  useEffect(() => {
    console.log('Getting Questions');
    axios
      .get('http://localhost:4000/api/question/getQuestions', {
        params: {
          genre: genre,
        },
      })
      .then((response) => {
        console.log(response.data);
        setQuestions(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    console.log('Is Loading called');
    if (submitState === SUBMITTING) {
      submitClicked().then(() => {
        //handle success or faliure
        setSubmitState(SUBMITTED);
      });
    }
  }, [submitState]);

  const handleClick = () => setSubmitState(SUBMITTING);

  return (
    <div className="questionnaire">
      <h1>Questionnaire</h1>
      <div className="question-container">
        {questions.map((question, i) => {
          const ratingValue = i + 1;
          return (
            <label key={question._id}>
              <h4 className="question">{question.questionText}</h4>
              <span className="spacing"></span>
              {/* when star rating set scores dictionary value {question._id: score} to new score */}
              {/* <StarRating score={setScores(question)} /> */}
            </label>
          );
        })}
      </div>
      <div>
        <Button
          variant="primary"
          disabled={submitState === SUBMITTING}
          onClick={submitState === SUBMIT ? handleClick : null}
          //   as="input"
          //   type="submit"
          //   value="Submit"
          //   onClick={() => {
          //     submitClicked();
          //   }}
        >
          {submitState}
        </Button>
      </div>
    </div>
  );
};

export default Questionnaire;
