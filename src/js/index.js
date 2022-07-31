import '../scss/main.scss';

import { currentUser, makeRequest, getCurrentUser } from './api';
import { CsComment } from './components/CsComment';
import { CsAddComment } from './components/CsAddComment';

const createComments = (comments) => {
  const parentContainer = document.getElementById('comments');

  comments.forEach((commentData, i) => {
    const comment = new CsComment({ ...commentData, dbId: i }, parentContainer);

    if (comment.repliesNumber) {
      comment.replies.forEach((reply, j) => {
        const replyComponent = new CsComment({ ...reply, dbId: j }, comment.repliesContainer, comment);

        comment.appendReplyComponent(replyComponent);
      });
    }
  });
}

const createAddComment = () => {
  const parentElement = document.getElementById('new-comment');

  new CsAddComment(parentElement, currentUser);
}

getCurrentUser().then(() => {
  createAddComment();
  makeRequest('comments.json').then(data => createComments(data));
});