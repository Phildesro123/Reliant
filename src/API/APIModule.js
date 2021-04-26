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

/**
 * Get stored notes from reliant database
 * @param url URL of website you want notes for
 * @param userID UserID
 * @returns note containers
 */
export const getNotes = async (url, userID) => {
  const res = await axios.get('user/getNotes', {
    params: {
      url,
      _id: userID,
    },
  });

  return await res;
};

/**
 * Add/Edit a note
 * @param userID UserID
 * @param url URL of website
 * @param range Range of the note
 * @param content Content of the note
 */
export const addOrEditNote = async (userID, url, range, content) => {
  const res = await axios.post('user/addNotes', {
    _id: userID,
    url,
    range,
    content,
  });

  return await res;
};

/**
 * Delete a note
 * @param userID UserID
 * @param url URL of the website
 * @param range Range of the note
 */
export const deleteNote = async (userID, url, range) => {
  const res = await axios.post('user/deleteNotes', {
    _id: userID,
    url,
    range,
  });

  return await res;
};

/**
 * Add user suggested info for author
 * @param userID UserID
 * @param url URL of website
 * @param suggestion Suggestion being added
 */
export const submitSuggestion = async (userID, url, suggestion) => {
  const res = await axios.post('user/submitSuggestion', {
    _id: userID,
    url,
    suggestion,
  });

  return await res;
};

/**
 * Get user's suggested info of website if it exists
 * @param userID UserID
 * @param url 
 * @returns 
 */
export const getSuggestedInfo = async (userID, url) => {
  const res = await axios.get('user/getSuggestedInfo', {
    params: {
      _id: userID,
      url
    }
  });
  
  return await res;
}

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
 * @param userID User's ID
 * @param highlightSelection Highlight Selection string
 * @param highlight_type Type of highlight
 */
export const addHighlights = async (
  url,
  userID,
  highlightSelection,
  highlight_type
) => {
  const res = await axios.post('websites/addHighlights', {
    url,
    userID,
    highlightSelection,
    highlight_type,
  });

  return await res;
};

/**
 * Get stored comments from reliant database
 * @param url URL of website you want comments for
 * @returns Comment containers
 */
export const getComments = async (url) => {
  const res = await axios.get('websites/getComments', {
    params: {
      url,
    },
  });

  return await res;
};

/**
 * Add a comment
 * @param url URL for website
 * @param userID UserID
 * @param userName Display name of the user
 * @param range Range of the comment container
 * @param content Content of the comment
 */
export const addComment = async (url, userID, userName, range, content) => {
  const res = await axios.post('websites/addComment', {
    url,
    userID,
    userName,
    range,
    content,
  });

  return await res;
};

/**
 * Reply to a comment
 * @param url URL of website
 * @param parentID OwnerID of comment
 * @param parentContent Content of comment
 * @param userID OwnerID of user replying
 * @param userName Display name of user replying
 * @param range Range
 * @param content Content of reply
 */
export const addReply = async (
  url,
  parentID,
  parentContent,
  userID,
  userName,
  range,
  content
) => {
  const res = await axios.post('websites/addReply', {
    url,
    parentID,
    parentContent,
    userID,
    userName,
    range,
    content,
  });

  return await res;
};

/**
 * Delete comment from database
 * @param url URL of website
 * @param userID UserID
 * @param range Range of comment container
 * @param content Content of the comment being deleted
 */
export const deleteComment = async (url, userID, range, content) => {
  const res = await axios.post('websites/deleteComment', {
    url,
    userID,
    range,
    content,
  });

  return await res;
};
