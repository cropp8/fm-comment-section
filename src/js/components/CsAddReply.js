import state from '../state';
import { CsAddComment } from './CsAddComment';
import { CsComment } from './CsComment';
import { addReply } from '../actions/addReply';

export class CsAddReply extends CsAddComment {
  parentComment;

  constructor(parentElement, parentComment, username) {
    super(parentElement, state.currentUser, 'Reply', username);
    this.parentComment = parentComment;
    this.onOuterClick = this.onOuterClick.bind(this);
    this.setOuterClickListener();
    this.focusOnField();
  }

  setOuterClickListener() {
    document.body.addEventListener('click', this.onOuterClick);
  }

  onOuterClick(e) {
    if (e.composedPath().includes(this.element)) {
      return;
    }

    this.destroy();
  }

  addComment(commentText, replyingTo) {
    const parentDbId = this.parentComment.dbId;
    const parentRepliesNumber = this.parentComment.repliesNumber;

    addReply(commentText, parentDbId, parentRepliesNumber, replyingTo)
      .then((reply) => {
        const replyComponent = new CsComment({ ...reply, dbId: parentRepliesNumber }, this.parentComment.repliesContainer, this.parentComment);

        this.parentComment.appendReplyComponent(replyComponent);
        this.destroy();
        replyComponent.element.scrollIntoView({ behavior: 'smooth' });
      })
      .catch((error) => console.error(error));
  }

  focusOnField() {
    this.element.querySelector('.cs-add-comment__textarea').focus();
  }

  destroy() {
    this.element.remove();
    document.body.removeEventListener('click', this.onOuterClick);
    this.parentComment.destroyReplyForm();
  }
};