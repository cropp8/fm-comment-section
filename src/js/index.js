import '../scss/main.scss';

import { makeRequest, getCurrentUser } from './api';
import { CsComment } from './components/CsComment';


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

getCurrentUser().then(() => {
  makeRequest('comments.json').then(data => createComments(data));
});