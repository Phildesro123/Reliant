import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = (props) => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  const changeScore = (ratingValue) => {
    var scores = props.scores;
    scores[props.questionID] = {
      score: ratingValue,
      questionWeight: props.questionWeight,
    };
    props.scoreCallback(scores);
    props.checkFormCallback();
    setRating(ratingValue);
  };
  useEffect(() => {
    const value = props.initialValue
    if (value !== 0) {
      setRating(value)
      var scores = props.scores;
      scores[props.questionID] = {
        score: value,
        questionWeight: props.questionWeight,
      };
      props.scoreCallback(scores);
    }    
  }, [])

  return (
    <div className="star-container">
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <label key={'star_' + i}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => changeScore(ratingValue)}
            />
            <FaStar
              className="star"
              color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
              size={25}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
