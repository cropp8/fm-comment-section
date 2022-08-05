import { addComment } from '../actions/addComment';

export class CsAddComment {
  element;
  submitButtonText = 'Send';

  constructor(parentElement, currentUser, submitButtonText = 'Send') {
    const addCommentTemplate = document.getElementById('add-comment-template').content.querySelector('.cs-add-comment');

    this.element = addCommentTemplate.cloneNode(true);
    this.populateWithData(currentUser, submitButtonText);
    this.setSubmitListener();
    this.appendToParent(parentElement);
  }

  populateWithData(currentUser, submitButtonText) {
    const { image: { png } } = currentUser;
    const userPicture = this.element.querySelector('.cs-add-comment__user-picture-img');
    const submitButton = this.element.querySelector('.cs-add-comment__button');

    userPicture.src = png;
    submitButton.innerHTML = submitButtonText;
  }

  setSubmitListener() {
    const form = this.element.querySelector('.cs-add-comment__form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const commentText = form.querySelector('.cs-textarea').value;

      this.addComment(commentText);
    });
  }

  addComment(commentText) {
    addComment(commentText);
  }

  appendToParent(parentElement) {
    parentElement.appendChild(this.element);
  }
}