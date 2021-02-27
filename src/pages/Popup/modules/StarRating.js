import React, {useEffect, useState} from 'react'
import { FaStar } from "react-icons/fa"

const StarRating = (props) => {
    const percentage = (props.rating / 5.0) * 100
    return <div className="star-rating">
        <div className="back-stars">
            {[...Array(5)].map((star, i) => {
                return (
                    <label className="star" key={"back_star_" + i}>
                        <FaStar color="#e4e5e9" size={25} />
                    </label>
                );
            })}
            <div className="front-stars" style={{width: percentage + "%"}}>
                {[...Array(5)].map((star, i) => {
                    return (
                    <label className="star" key={"front_star_" + i}>
                        <FaStar color="#ffc107" size={25} />
                    </label>
                    );
                })}
            </div>
        </div>
    </div>
}

export default StarRating