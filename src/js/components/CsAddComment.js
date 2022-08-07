import { addComment } from '../actions/addComment';

export class CsAddComment {
  element;
  form;
  submitButtonText = 'Send';
  replyingTo;

  constructor(parentElement, currentUser, submitButtonText = 'Send', replyingTo) {
    const addCommentTemplate = document.getElementById('add-comment-template').content.querySelector('.cs-add-comment');

    this.element = addCommentTemplate.cloneNode(true);
    this.form = this.element.querySelector('.cs-add-comment__form');
    this.replyingTo = replyingTo;
    this.populateWithData(currentUser, submitButtonText);
    this.setSubmitListener();
    this.appendToParent(parentElement);
  }

  populateWithData(currentUser, submitButtonText) {
    const { image: { png } } = currentUser;
    const userPicture = this.element.querySelector('.cs-add-comment__user-picture-img');
    const submitButton = this.element.querySelector('.cs-add-comment__button');
    const textArea = this.element.querySelector('.cs-add-comment__textarea');

    userPicture.src = png;
    submitButton.innerHTML = submitButtonText;

    if (this.replyingTo) {
      textArea.value = `@${this.replyingTo} `;
    }
  }

  setSubmitListener() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isAReply;
      const textareaValue = this.form.querySelector('.cs-add-comment__textarea').value;

      if (this.replyingTo) {
        isAReply = textareaValue[0] === '@' && textareaValue.substring(1, this.replyingTo.length + 1) === this.replyingTo;
      }
 
      const commentText = isAReply ? textareaValue.substring(this.replyingTo.length + 1) : textareaValue;

      this.addComment(commentText, this.replyingTo);
    });
  }

  addComment(commentText) {
    addComment(commentText)
      .then((result) => {
        if (result === 'success') {
          this.form.reset();
        }
      });
  }

  appendToParent(parentElement) {
    parentElement.appendChild(this.element);
  }
}