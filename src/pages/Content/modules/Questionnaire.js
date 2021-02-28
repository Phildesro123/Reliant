import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { submitQuestionnaire } from '..';
import axios from 'axios';

const Questionnaire = () => {
  const genre = 'Tech';
  const SUBMIT = 'Submit';
  const SUBMITTING = 'Submitting...';
  const SUBMITTED = 'Questionnaire submitted';
  const FAILED = 'Failed to submit questionnaire please try again later.';

  const [scores, setScores] = useState({});
  const [questions, setQuestions] = useState([]);
  const [submitState, setSubmitState] = useState(SUBMIT);
  const [completedForm, setCompletedForm] = useState(false);

  function checkFormCompletion() {
    if (Object.keys(scores).length === questions.length) {      
      setCompletedForm(true)
    }
    if (submitState !== SUBMIT) {
      setSubmitState(SUBMIT)
    }
  }

  // fetches the questions once the questionnaire is made
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


  // handles the submit button state
  useEffect(() => {
    console.log('Is Loading called');
    if (submitState === SUBMITTING) {
      console.log('Submitting questionnaire with scores:', scores);
      submitQuestionnaire(scores)
        .then(() => {
          //handle success or faliure
          setSubmitState(SUBMITTED);
        })
        .catch((err) => {
          console.log('Questionnaire Error:', err);
          setSubmitState(FAILED);
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
            //
            <label className="question-label" key={question._id}>
              <h4 className="question">{question.questionText}</h4>
              <span className="spacing"></span>
              <StarRating
                scores={scores}
                questionID={question._id}
                questionWeight={question.questionWeight}
                scoreCallback={setScores}
                checkFormCallback={checkFormCompletion}
              />
            </label>
          );
        })}
      </div>
      <div>
        <button
          className="submit-btn"
          disabled={submitState !== SUBMIT || !completedForm}
          onClick={submitState === SUBMIT ? handleClick : null}
        >
          {submitState}
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;
