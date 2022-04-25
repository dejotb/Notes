/* eslint max-classes-per-file: ["error", 2] */

class Note {
  date = new Date();

  id = `${new Date().getTime()}`.slice(-10);

  constructor(color, title, text) {
    this.color = color; // item background color
    this.title = title; // input title
    this.text = text; // input text
  }
}

// APPLICATION ARCHITECTURE
const container = document.querySelector('.container');
// const formTitle = document.querySelector('.form__title');
// const formText = document.querySelector('.form__text');
const listItems = document.querySelector('.list__items');
const buttonCreateNewNote = document.querySelector('.button--cta');
const modalContainer = document.querySelector('.modal__container');
const modalInput = document.querySelector('.modal__input');

class App {
  #notes = [];

  constructor() {
    buttonCreateNewNote.addEventListener('click', this._newNote.bind(this));
    listItems.addEventListener('click', this._handleNote.bind(this));
    modalContainer.addEventListener('click', this._handleNote.bind(this));

    // Get data from local storage
    this._getLocalStorage();

    // Show instruction if no notes are added
    this._showInstruction();
  }

  _newNote() {
    // create new note
    const note = new Note(this._getRandomColor(0, 9));

    // Add new note to notes array
    this.#notes.push(note);

    // Render input form
    this._renderFormInputItem(note);

    // Animate new note button
    this._animateButton();

    console.log(this.#notes);

    container.style.opacity = 0;
    document.querySelector('.button--cta-instruction').classList.add('hide');
  }

  _renderListItem(note) {
    const html = `
      <li class="list__item list__item--rendered" data-id="${
        note.id
      }" style='background-color:rgb(${
      note.color
    }); color: ${this._darkenRandomColor(note.color, 2.5)}'>
        <h2 style='color: ${this._darkenRandomColor(note.color, 2.3)}'>${
      !note.title ? '' : note.title
    }</h2>
        <p style='scrollbar-color: ${this._darkenRandomColor(
          note.color,
          1.5
        )} rgb(${note.color}) '>${!note.text ? '' : note.text}
        </p>
      </li>`;

    if (!note.title && !note.text) return;

    listItems.insertAdjacentHTML('afterbegin', html);
  }

  _renderFormInputItem(note) {
    const html = `
      <li class="list__item list__item--input" data-id="${
        note.id
      }" style='background-color:rgb(${note.color})'>
        <button class="button button__form--save--exit" type="submit" title="save"> <img src="img/arrow.svg" alt="save note"></button>
        <form class="form" name="notes__form">

          <input style='color: ${this._darkenRandomColor(
            note.color,
            2.75
          )}' maxlength="20" name="title" type="text" class="form__title" placeholder="Name..." value="${
      !note.title ? '' : note.title
    }"/>
          <textarea
          name=""
          class="form__text"
          required=""
          placeholder="Note..."
          style='scrollbar-color: ${this._darkenRandomColor(
            note.color,
            1.5
          )} rgb(${note.color}); color: ${this._darkenRandomColor(
      note.color,
      2.5
    )}'>${!note.text ? '' : note.text}</textarea>
        </form>
        <button class='button button__form--delete' title="delete"><img src="img/bin.svg" alt="delete note"></button>
      </li>`;

    modalInput.insertAdjacentHTML('afterbegin', html);
    modalContainer.classList.remove('hide');
  }

  _handleNote(e) {
    e.preventDefault();

    if (e.target.classList.contains('modal__container')) {
      container.style.opacity = 1;
      modalInput.textContent = '';
      listItems.textContent = '';
      modalContainer.classList.add('hide');
      this._getLocalStorage();
      console.log(this.#notes);

      //! clean code with save method
    }

    if (e.target.closest('.button__form--save--exit')) {
      this._saveSelectedNote();
    }

    if (e.target.closest('.button__form--delete')) {
      console.log(e);
      this._deleteSelectedNote(e);
    }

    if (e.currentTarget.classList.contains('list__items')) {
      const el = e.target.closest('.list__item');

      if (!el) {
        return;
      }

      container.style.opacity = 0;
      const note = this.#notes.find((listEl) => listEl.id === el.dataset.id);
      this._renderFormInputItem(note);
      if (note.title || note.text) {
        this._setLocalStorage();
      }
    }
  }

  _saveSelectedNote() {
    const el = modalInput.querySelector('.list__item');
    const note = this.#notes.find((listEl) => listEl.id === el.dataset.id);
    note.title = el.querySelector('.form__title').value;
    note.text = el.querySelector('.form__text').value;
    container.style.opacity = 1;

    // remove note from notes array if input is empty
    if (!note.title && !note.text) {
      this.#notes = this.#notes.filter((listEl) => listEl.id !== el.dataset.id);
    }

    if (note.title || note.text) {
      this._setLocalStorage();
      console.log(this.#notes);
    }

    modalInput.textContent = '';
    listItems.textContent = '';
    modalContainer.classList.add('hide');

    this._getLocalStorage();

    // check if a note is already rendered in the DOM
    if ([...listItems.children].some((listEl) => listEl.dataset.id === note.id))
      return;

    this._renderListItem(note);
    console.log(this.#notes);
  }

  _deleteSelectedNote(e) {
    const el = e.target.closest('.list__item');
    const elId = listItems.querySelector(`[data-id='${el.dataset.id}']`);
    this.#notes = this.#notes.filter((listEl) => listEl.id !== el.dataset.id);
    container.style.opacity = 1;

    this._setLocalStorage();
    modalInput.textContent = '';
    modalContainer.classList.add('hide');

    if (!elId) return;
    elId.remove();

    console.log(this.#notes);
  }

  _setLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(this.#notes));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('notes'));

    if (!data) return;

    this.#notes = data;

    this.#notes.forEach((note) => {
      this._renderListItem(note);
    });
    console.log('got local storage');
  }

  // reset() {
  //   localStorage.removeItem('workouts');
  //   location.reload();
  // }

  _animateButton() {
    const iconPlus = buttonCreateNewNote.querySelector('#icon__plus');
    iconPlus.classList.add('fade-out-in');
    buttonCreateNewNote.classList.add('hover');
    setTimeout(() => {
      iconPlus.classList.remove('fade-out-in');
      buttonCreateNewNote.classList.remove('hover');
    }, 500);
  }

  _getRandomColor(min, max) {
    const colors = [
      '250,226,131',
      '209,154,200',
      '113,206,204',
      '135,204,58',
      '68,68,68',
      '199,178,135',
      '211,212,233',
      '241,207,48',
      '250,205,199',
      // '#FAE283',
      // '#D19AC8',
      // '#71CECC',
      // '#87CC3A',
      // '#FA742B',
      // '#C7B287',
      // '#D3D4E9',
      // '#F1CF30',
      // '#FACDC7',
    ];

    const number = Math.floor(Math.random() * (max - min) + min);
    return colors[number];
  }

  _darkenRandomColor(inputColor, factor) {
    return `rgb(${inputColor
      .split(',')
      .map((color) => color - (255 - color) * factor)
      .join(',')})`;
  }

  _showInstruction() {
    if (this.#notes.length) {
      return;
    }

    if (this.#notes.length === 0) {
      setTimeout(() => {
        const instruction = document.querySelector('.button--cta-instruction');
        instruction.classList.remove('hide');
      }, 2000);
    }
  }
}

const app = new App();
