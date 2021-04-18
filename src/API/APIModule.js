import axios from 'axios';

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://reliant-api.herokuapp.com/api/';
} else if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:4000/api/';
}

// Question clientAPI

/**
 * Get questions for questionnaire of a specific genre
 * @param genre Genre of questions
 */
export const getQuestion = async (genre) => {
  const res = await axios.get('question/getQuestions', {
    params: {
      genre,
    },
  });
  return await res;
};

// Reviews Client API

/**
 * Get user's review results for a specific website
 * @param userId UserID 
 * @param url URL you want the user's results from
 */
export const getResults = async (userId, url) => {
  const res = await axios.get('reviews/getResults', {
    params: {
      userId,
      url,
    },
  });
  return await res;
};

/**
 * Add review of website
 * @param _id Object that contains: {userId, URL}
 * @param results User's questionnaire results
 * @param score Score of questionnaire
 * @param time Time spent reading the article 
 */
export const addReview = async (_id, results, score, time) => {
  const res = await axios.post('reviews/addReview', {
    _id,
    results,
    overallScore: score,
    timeNeeded: time,
  });
  return await res;
};

// User Client API

/**
 * Add user to reliant database
 * @param userId UserID (usually acquired from Google's API) 
 * @param email User's email address 
 */
export const addUser = async (userId, email) => {
  const res = await axios.post('user', {
    _id: userId,
    email,
    displayName: email,
  });
  return await res;
};

/**
 * Update user's visitedSite list
 * @param userId UserID
 * @param website {timespent, _id:URL}
 */
export const updateWebsite = async (userId, website) => {
  const res = await axios.post('user/updateSites', {
    _id: userId,
    website,
  });
  return await res;
};

//Website Client API

/**
 * Get stored data of website
 * @param url URL of website 
 */
export const getSiteData = async (url) => {
  const res = await axios.get('websites/getSiteData', {
    params: {
      _id: url,
    },
  });
  return await res;
};

/**
 * Add a website to Reliant's database
 * @param url URL of website to add
 */
export const addSite = async (url) => {
  const res = await axios.post('websites/addSite', {
    _id: url,
  });
  return await res;
};

/**
 * Get user's stored highlights
 * @param url URL of website
 * @param userID User's ID
 */
export const getUserHighlights = async (url, userID) => {
  const res = await axios.get('websites/getUserHighlights', {
    params: {
      url,
      userID,
    },
  });
  return await res;
};

/**
 * Store user's highlight
 * @param url URL of website
 * @param {*} userID User's ID
 * @param {*} highlightSelection Highlight Selection string 
 * @param {*} highlight_type Type of highlight
 */
export const addHighlights = async (url, userID, highlightSelection, highlight_type) => {
  const res = await axios.post('websites/addHighlights', {
    url,
    userID,
    highlightSelection,
    highlight_type
  });

  return await res;
};
