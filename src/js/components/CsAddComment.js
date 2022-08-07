import { addComment } from '../actions/addComment';
import { getMentionAndText } from '../utilities/getMentionAndText';

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

      const textareaValue = this.form.querySelector('.cs-add-comment__textarea').value;
      const mentionAndText = getMentionAndText(textareaValue);
      const commentText = mentionAndText?.[1] || textareaValue;
      const mention = mentionAndText?.[0];

      this.addComment(commentText, mention);
    });
  }

  addComment(commentText, replyingTo) {
    addComment(commentText, replyingTo)
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