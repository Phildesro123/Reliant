import axios from 'axios';

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://reliant-api.herokuapp.com/api/';
} else if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:4000/api/';
}

// Question clientAPI
export const getQuestion = async (genre) => {
  const res = await axios.get('question/getQuestions', {
    params: {
      genre,
    },
  });
  return await res;
};

// Reviews Client API
export const getResults = async (userId, url) => {
  const res = await axios.get('reviews/getResults', {
    params: {
      userId,
      url,
    },
  });
  return await res;
};

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
export const addUser = async (userId, email) => {
  const res = await axios.post('user', {
    _id: userId,
    email,
    displayName: email,
  });
  return await res;
};

export const updateWebsite = async (userId, website) => {
  const res = await axios.post('user/updateSites', {
    _id: userId,
    website,
  });
  return await res;
};

//Website Client API
export const getSiteData = async (url) => {
  const res = await axios.get('websites/getSiteData', {
    params: {
      _id: url,
    },
  });
  return await res;
};

export const addSite = async (url) => {
  const res = await axios.post('websites/addSite', {
    _id: url,
  });
  return await res;
};

export const getUserHighlights = async (url, userID) => {
  const res = await axios.get('websites/getUserHighlights', {
    params: {
      url,
      userID,
    },
  });
  return await res;
};

export const addHighlights = async (url, userID, highlightSelection, highlight_type) => {
  const res = await axios.post('websites/addHighlights', {
    url,
    userID,
    highlightSelection,
    highlight_type
  });

  return await res;
};
