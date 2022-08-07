import state from '../state';
import { makeRequest } from '../api';

export function addReply(commentText, parentDbId, parentRepliesNumber, replyingTo) {
  const commentBody = {
    id: parentRepliesNumber + 1,
    content: commentText,
    createdAt: new Date().toUTCString(),
    score: 0,
    user: state.currentUser,
    replies: [],
    replyingTo,
  };

  return makeRequest(`comments/${parentDbId}/replies/${parentRepliesNumber}.json`, 'PUT', commentBody);
}