import '../scss/main.scss';

import state from './state';
import { makeRequest } from './api';
import { getCurrentUser } from './actions/getCurrentUser';
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

  new CsAddComment(parentElement, state.currentUser);
}

getCurrentUser()
  .then(() => {
    createAddComment();
    makeRequest('comments.json').then(data => createComments(data));
  })
  .catch((error) => console.error(error));

// const comment = {
//   id: 2,
//   content: 'Hello world',
//   createdAt: new Date('2022-08-02').toUTCString(),
//   score: 5,
//   user: {
//     username: 'amyrobson',
//     image: {
//       png: 'https://i.imgur.com/7kNxKIt.png',
//       webp: '',
//     }
//   },
//   replies: [],
//   replyingTo: 'maxblagun'
// };

// makeRequest(`comments/1/replies/1.json`, 'PUT', comment);