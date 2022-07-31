import { CsComment } from './components/CsComment';

export let currentUser = null;

makeRequest('currentUser.json').then(data => {
  currentUser = data;
});

export function getCurrentUser() {
  return makeRequest('currentUser.json').then(data => {
    currentUser = data;
  });
}

export function findUserVote(votes) {
  if (!votes) {
    return;
  }
  
  return votes.find((vote) => vote.username === currentUser.username);
}

export function voteOnComment(upvote = true, id, parentId) {
  const path = parentId ? `comments/${parentId}/replies/${id}.json` : `comments/${id}.json`;

  return makeRequest(path).then(data => {
    const commentData = data;
    let currentUserVote;

    function setScore(increase, amount) {
      if (increase) {
        commentData.score += amount;
      } else {
        commentData.score -= amount;
      }
    }

    if (commentData.votes?.length > 0) {
      currentUserVote = findUserVote(commentData.votes);

      if (currentUserVote) {
        if (currentUserVote.upvoted === upvote) {
          return new Promise((resolve, reject) => {
            reject();
          });
        } else {
          setScore(upvote, 2);
        }
      } else {
        setScore(upvote, 1);
      }
    } else {
      setScore(upvote, 1);
    }
  
    commentData.votes = [{ username: currentUser.username, upvoted: upvote }];

    return updateRating(path, commentData);
  });
}

function updateRating(path, newCommentData) {
  return makeRequest(path, 'PUT', newCommentData);
}

export function addComment(commentText) {
  const parentContainer = document.getElementById('comments');
  const commentBody = {
    id: null,
    content: commentText,
    createdAt: 'just now',
    score: 0,
    user: currentUser,
    replies: [],
  };
  let commentDbId;

  makeRequest('comments.json')
    .then((comments) => {
      commentDbId = comments.length;
      commentBody.id = commentDbId + 1;

      return makeRequest(`comments/${commentDbId}.json`, 'PUT', commentBody)
    })
    .then((response) => {
      new CsComment({ ...response, dbId: commentDbId }, parentContainer);
    })
    .catch((error) => console.error(error));

  //makeRequest('comments-test/2.json', 'DELETE');
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