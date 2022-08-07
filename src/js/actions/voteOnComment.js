import state from '../state';
import { makeRequest } from '../api';
import { findUserVote } from '../utilities/findUserVote';

function updateRating(path, newCommentData) {
  return makeRequest(path, 'PUT', newCommentData);
}

export function voteOnComment(upvote = true, id, parentId) {
  const path = typeof parentId === 'number' ? `comments/${parentId}/replies/${id}.json` : `comments/${id}.json`;

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

    commentData.votes = [{ username: state.currentUser.username, upvoted: upvote }];

    return updateRating(path, commentData);
  });
}