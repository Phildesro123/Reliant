import React, { useEffect, useState } from 'react'
import { FaStar } from "react-icons/fa"

const StarRating = (props) => {
    const [rating, setRating] = useState(null)
    const [hover, setHover] = useState(null);

    const changeScore = (ratingValue) => {
        props.updateScore(ratingValue)
        setRating(ratingValue)
    }
    return <div className="star-container">
        {[...Array(5)].map((star, i) => {
            const ratingValue = i + 1;
            return (
            <label key={"star_" + i}>
                <input type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => changeScore(ratingValue)}
                />
                <FaStar className="star" color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"} size={25} 
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(null)}
                />
            </label>
            );
        })}
    </div>
}

export default StarRating