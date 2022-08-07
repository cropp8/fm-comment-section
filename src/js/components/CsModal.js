export class CsModal {
  element;
  deleteFunction;

  constructor(deleteFunction) {
    const modalTemplate = document.getElementById('modal-template').content.querySelector('.cs-modal');

    this.element = modalTemplate.cloneNode(true);
    this.deleteFunction = deleteFunction;
    this.setEventListeners();
    document.body.appendChild(this.element);
    document.body.classList.add('--cs-modal-open');
  }

  setEventListeners() {
    const backdrop = this.element.querySelector('.cs-modal__backdrop');
    const closeButton = this.element.querySelector('.cs-modal__button-close');
    const deleteButton = this.element.querySelector('.cs-modal__button-delete');

    backdrop.addEventListener('click', () => {
      this.destroy();
    });

    closeButton.addEventListener('click', () => {
      this.destroy();
    });

    deleteButton.addEventListener('click', () => {
      this.deleteFunction();
      this.destroy();
    });
  }

  destroy() {
    this.element.remove();
    document.body.classList.remove('--cs-modal-open');
  }
}