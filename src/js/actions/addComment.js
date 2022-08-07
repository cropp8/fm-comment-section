import state from '../state';
import { makeRequest } from '../api';
import { CsComment } from '../components/CsComment';

export function addComment(content, replyingTo) {
  const parentContainer = document.getElementById('comments');
  const commentBody = {
    id: null,
    content,
    createdAt: new Date().toUTCString(),
    score: 0,
    user: state.currentUser,
    replies: [],
    replyingTo,
  };
  let commentDbId;

  return makeRequest('comments.json')
    .then((comments) => {
      commentDbId = comments.length;
      commentBody.id = commentDbId + 1;

      return makeRequest(`comments/${commentDbId}.json`, 'PUT', commentBody);
    })
    .then((response) => {
      new CsComment({ ...response, dbId: commentDbId }, parentContainer);
      return Promise.resolve('success');
    })
    .catch((error) => console.error(error));
}