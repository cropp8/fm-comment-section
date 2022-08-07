import { makeRequest } from '../api';

export function updateComment({ id, content, createdAt, score, user, replies, replyingTo }, dbId, parentDbId) {
  const commentBody = {
    id,
    content,
    createdAt,
    score,
    user,
    replies,
    replyingTo,
  };

  return makeRequest(typeof parentDbId === 'number' ? `comments/${parentDbId}/replies/${dbId}.json` : `comments/${dbId}.json`, 'PUT', commentBody);
}