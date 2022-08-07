import { makeRequest } from '../api';

function filterOutCommentToDelete(commentsArray, idToDelete) {
  return commentsArray.filter((comment, dbId) => dbId !== idToDelete);
}

export function deleteComment(commentDbId, parentDbId) {
  return makeRequest('comments.json')
    .then(data => {
      if (typeof parentDbId === 'number') {
        data[parentDbId].replies = filterOutCommentToDelete(data[parentDbId].replies, commentDbId);
      } else {
        data = filterOutCommentToDelete(data, commentDbId);
      }

      return Promise.resolve(data);
    })
    .then((updatedCommentsData) => {
      console.log(updatedCommentsData);
      return makeRequest(`comments.json`, 'PUT', updatedCommentsData);
    })
    .catch((error) => console.error(error));
}