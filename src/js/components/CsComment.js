import { voteOnComment, findUserVote } from '../api';

export class CsComment {
  element;
  dbId;
  replies;
  repliesNumber = 0;
  replyComponents = [];
  repliesContainer;
  parentComponent;

  constructor(data, parentContainer, parentComponent) {
    const commentTemplate = document.getElementById('comment-template').content.querySelector('.cs-comment');

    this.element = commentTemplate.cloneNode(true);
    this.dbId = data.dbId;
    this.repliesContainer = this.element.querySelector('.cs-comment__replies');

    if (data.replies && data.replies.length) {
      this.replies = data.replies;
      this.repliesNumber = data.replies.length;
    }

    if (parentComponent) {
      this.parentComponent = parentComponent;
    }

    this.populateWithData(data);
    this.setEventListeners();
    this.appendToParent(parentContainer);
  }

  populateWithData({ content, createdAt, score, replyingTo, user, votes }) {
    const userPicture = this.element.querySelector('.cs-comment__user-picture-img');
    const userName = this.element.querySelector('.cs-comment__user-name');
    const date = this.element.querySelector('.cs-comment__date');
    const mention = this.element.querySelector('.cs-comment__mention');
    const comment = this.element.querySelector('.cs-comment__comment');
    const rating = this.element.querySelector('.cs-rating__number');
    const currentUserVote = findUserVote(votes);

    userPicture.src = user.image.png;
    userName.innerHTML = user.username;
    date.innerHTML = createdAt;
    comment.innerHTML = content;
    rating.innerHTML = score;

    if (replyingTo) {
      mention.innerHTML = replyingTo;
    }

    if (currentUserVote) {
      this.element.querySelector(`.cs-rating__btn--${currentUserVote.upvoted ? 'plus' : 'minus'}`).classList.add('cs-rating__btn--active');
      this.element.querySelector(`.cs-rating__btn--${currentUserVote.upvoted ? 'minus' : 'plus'}`).classList.remove('cs-rating__btn--active');
    }
  }

  setEventListeners() {
    const ratingButtons = this.element.querySelectorAll('.cs-rating__btn');

    ratingButtons.forEach((button) => {
      const upvote = button.classList.contains('cs-rating__btn--plus');
      let parentId;

      button.addEventListener('click', () => {
        console.log('rating btn click', this.dbId);
        if (this.parentComponent) {
          parentId = this.parentComponent.dbId;
        }

        voteOnComment(upvote, this.dbId, parentId)
        .then((newData) => {
          this.populateWithData(newData);
        })
        .catch(() => {});
      });
    });
  }

  appendToParent(parentContainer) {
    parentContainer.appendChild(this.element);
  }

  appendReplyComponent(replyCsComment) {
    this.replyComponents.push(replyCsComment);
  }
}