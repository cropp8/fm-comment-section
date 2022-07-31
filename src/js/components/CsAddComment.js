import { addComment } from '../api';

export class CsAddComment {
  element;

  constructor(parentElement, currentUser) {
    const addCommentTemplate = document.getElementById('add-comment-template').content.querySelector('.cs-add-comment');

    this.element = addCommentTemplate.cloneNode(true);
    this.populateWithData(currentUser);
    this.setEventListeners();
    this.appendToParent(parentElement);
  }

  populateWithData(currentUser) {
    const { image: { png }, username } = currentUser;
    const userPicture = this.element.querySelector('.cs-add-comment__user-picture-img');
    
    userPicture.src = png;
  }

  setEventListeners() {
    const form = this.element.querySelector('.cs-add-comment__form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const commentText = form.querySelector('.cs-textarea').value;

      addComment(commentText);
    });
  }

  appendToParent(parentElement) {
    parentElement.appendChild(this.element);
  }
}