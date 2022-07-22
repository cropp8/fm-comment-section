let currentUser = null;

makeRequest('currentUser.json').then(data => {
  currentUser = data;
});

export function voteOnComment(upvote = true, id, parentId) {
  const path = parentId ? `comments/${parentId}/replies/${id}.json` : `comments/${id}.json`;

  return makeRequest(path).then(data => {
    const commentData = data;
    
    if (upvote) {
      commentData.score++;
    } else {
      commentData.score--;
    }

    return updateRating(path, commentData);
  });
}

function updateRating(path, newCommentData) {
  return makeRequest(path, 'PUT', newCommentData);
}

export async function makeRequest(path, method, data) {
  const requestOptions = {};

  requestOptions.method = method || 'GET';

  if (data) {
    requestOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`https://comment-section-new-default-rtdb.europe-west1.firebasedatabase.app/${path}`, requestOptions);

    return response.json();
  } catch (error) {
    console.error(error);
  }
}