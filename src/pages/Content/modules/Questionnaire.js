import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { submitQuestionnaire } from '..';
import axios from 'axios';

function Questionnaire(props) {
  const SUBMIT = 'Submit';
  const SUBMITTING = 'Submitting...';
  const SUBMITTED = 'Questionnaire submitted';
  const FAILED = 'Failed to submit questionnaire please try again later.';

  const [scores, setScores] = useState({});
  const [questions, setQuestions] = useState([]);
  const [submitState, setSubmitState] = useState(SUBMIT);
  const [completedForm, setCompletedForm] = useState(false);
  const [results, setResults] = useState([])
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
    axios
      .get('http://localhost:4000/api/question/getQuestions', {
        params: {
          genre: props.genre,
        },
      })
      .then((response) => {
        axios.get("http://localhost:4000/api/reviews/getResults", {params: {userId: props.userId, url: props.url}}).then((res) => {
          setResults(res.data);
          setQuestions(response.data);
        }).catch((err) => console.log(err))
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  // handles the submit button state
  useEffect(() => {
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
    <div className="bordered-container questionnaire-container">
      <h1>Questionnaire</h1>
      <div className="question-container">
        {questions.map((question, i) => {
          var value = 0;
          if (results.length > 0) {
            const temp = results.filter(result =>{
            return result._id === question._id;
            })
            if (temp.length > 0) {
              value = temp[0].response
            }
          }
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
                initialValue={value}
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
