import state from '../state';
import { makeRequest } from '../api';
import { CsComment } from '../components/CsComment';

export function addComment(commentText) {
  const parentContainer = document.getElementById('comments');
  const commentBody = {
    id: null,
    content: commentText,
    createdAt: new Date().toUTCString,
    score: 0,
    user: state.currentUser,
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