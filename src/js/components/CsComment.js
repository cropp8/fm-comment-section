import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { voteOnComment } from '../actions/voteOnComment';
import { deleteComment } from '../actions/deleteComment';
import { findUserVote } from '../utilities/findUserVote';
import { commentIsByCurrentUser } from '../utilities/commentIsByCurrentUser';
import { CsAddReply } from './CsAddReply';

dayjs.extend(relativeTime);

export class CsComment {
  element;
  dbId;
  username;
  byCurrentUser = false;
  replies;
  repliesNumber = 0;
  replyComponents = [];
  repliesContainer;
  parentComponent;
  replyForm;

  constructor(data, parentContainer, parentComponent) {
    const commentTemplate = document.getElementById('comment-template').content.querySelector('.cs-comment');

    this.element = commentTemplate.cloneNode(true);
    this.dbId = data.dbId;
    this.username = data.user?.username;
    this.byCurrentUser = commentIsByCurrentUser(this.username);
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
    const userName = this.element.querySelector('.cs-comment__user-name .name');
    const userYou = this.element.querySelector('.cs-comment__user-name .you');
    const date = this.element.querySelector('.cs-comment__date');
    const mention = this.element.querySelector('.cs-comment__mention');
    const comment = this.element.querySelector('.cs-comment__comment');
    const rating = this.element.querySelector('.cs-rating__number');
    const replyButtonContainer = this.element.querySelector('.cs-comment__reply');
    const editDeleteButtonsContainer = this.element.querySelector('.cs-comment__edit-delete');
    const currentUserVote = findUserVote(votes);

    userPicture.src = user.image.png;
    userName.innerHTML = user.username;
    date.innerHTML = dayjs().to(dayjs(createdAt));
    comment.innerHTML = content;
    rating.innerHTML = score;

    if (replyingTo) {
      mention.innerHTML = replyingTo;
    }

    if (currentUserVote) {
      this.element.querySelector(`.cs-rating__btn--${currentUserVote.upvoted ? 'plus' : 'minus'}`).classList.add('cs-rating__btn--active');
      this.element.querySelector(`.cs-rating__btn--${currentUserVote.upvoted ? 'minus' : 'plus'}`).classList.remove('cs-rating__btn--active');
    }

    if (this.byCurrentUser) {
      userYou.innerHTML = 'you';
      replyButtonContainer.remove();
    } else {
      editDeleteButtonsContainer.remove();
    }
  }

  setEventListeners() {
    const ratingButtons = this.element.querySelectorAll('.cs-rating__btn');
    const replyButton = this.element.querySelector('.cs-comment__reply-btn'); const deleteButton = this.element.querySelector('.cs-comment__delete-btn');

    ratingButtons.forEach((button) => {
      const upvote = button.classList.contains('cs-rating__btn--plus');
      let parentId;

      button.addEventListener('click', () => {
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

    if (this.byCurrentUser) {
      // edit & delete buttons
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteComment();
      });
    } else {
      replyButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.createReplyForm();
      });
    }
  }

  appendToParent(parentContainer) {
    parentContainer.appendChild(this.element);
  }

  appendReplyComponent(replyCsComment) {
    this.replyComponents.push(replyCsComment);
  }

  createReplyForm() {
    const replyForm = this.element.querySelector('.cs-comment__reply-form');

    this.replyForm = new CsAddReply(replyForm, this.parentComponent || this, this.username);
  }

  destroyReplyForm() {
    this.replyForm = null;
  }

  deleteComment() {
    deleteComment(this.dbId, this.parentComponent?.dbId)
      .then((response) => {
        this.destroy();
      })
      .catch((error) => console.error(error));
  }

  destroy() {
    this.element.remove();
  }
}