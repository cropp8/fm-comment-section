import state from '../state';
import { makeRequest } from '../api';
import { CsComment } from '../components/CsComment';

export function addReply(commentText, parentDbId, parentRepliesNumber) {
  const commentBody = {
    id: parentRepliesNumber + 1,
    content: commentText,
    createdAt: new Date().toUTCString,
    score: 0,
    user: state.currentUser,
    replies: [],
  };

  return makeRequest(`comments/${parentDbId}/replies/${parentRepliesNumber}.json`, 'PUT', commentBody);
}