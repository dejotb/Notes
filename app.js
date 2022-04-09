/* eslint max-classes-per-file: ["error", 2] */

class Note {
  date = new Date();

  id = `${new Date().getTime()}`.slice(-10);

  constructor(color, title, text) {
    this.color = color;
    this.title = title; // input title
    this.text = text; // input text
  }
}

// APPLICATION ARCHITECTURE
const container = document.querySelector('.container');
const formTitle = document.querySelector('.form__title');
const formText = document.querySelector('.form__text');
const listItems = document.querySelector('.list__items');
const buttonCreateNewNote = document.querySelector('.button--cta');
const modalContainer = document.querySelector('.modal__container');
const modalInput = document.querySelector('.modal__input');

class App {
  #notes = [];

  constructor() {
    buttonCreateNewNote.addEventListener('click', this._newNote.bind(this));
    listItems.addEventListener('click', this._handleNote.bind(this));
    modalInput.addEventListener('click', this._handleNote.bind(this));

    // Get data from local storage
    this._getLocalStorage();
  }

  _newNote() {
    // create new note
    const note = new Note(this._getRandomBackgroundColor(0, 6));

    // Add new note to notes array
    this.#notes.push(note);

    // Render input form
    this._renderFormInputItem(note);

    // Animate new note button
    this._animateButton();

    console.log(this.#notes);
  }

  _renderListItem(note) {
    const html = `
        <li class="list__item list__item--rendered" data-id="${
          note.id
        }" style='background-color:${note.color};'>
            <h2>${!note.title ? '' : note.title}</h2>
            <p>${!note.text ? '' : note.text}
            </p>
        </li>`;

    if (!note.title && !note.text) return;

    listItems.insertAdjacentHTML('afterbegin', html);
  }

  _renderFormInputItem(note) {
    const html = `
        <li class="list__item list__item--input" data-id="${
          note.id
        }" style='background-color:${note.color};'>
        <form class="form" name="notes__form">
        <button class="button button__form--save--exit" type="submit" title="return">◀️</button>
                <input maxlength="20" name="title" type="text" class="form__title" placeholder="Name..." value="${
                  !note.title ? '' : note.title
                }"/>
                <textarea
                name=""
                class="form__text"
                required=""
                placeholder="Note..."
                >${!note.text ? '' : note.text}</textarea>
            </form>
            <button class='button form__button--escape' title="delete">🗑️</button>
        </li>`;

    modalInput.insertAdjacentHTML('afterbegin', html);
    modalContainer.classList.remove('hide');
    document.querySelector('.form__text').focus();
    // const textarea = document.querySelector('textarea');
    // this._resizeTextArea(textarea);
  }

  _handleNote(e) {
    e.preventDefault();
    if (e.target.classList.contains('button__form--save--exit')) {
      this._saveSelectedNote(e);
    }

    if (e.target.classList.contains('form__button--escape')) {
      this._deleteSelectedNote(e);
    }

    if (e.currentTarget.classList.contains('list__items')) {
      const el = e.target.closest('.list__item');
      const note = this.#notes.find((listEl) => listEl.id === el.dataset.id);
      this._renderFormInputItem(note);

      if (note.title || note.text) {
        this._setLocalStorage();
      }
    }
  }

  _saveSelectedNote(e) {
    const el = e.target.closest('.list__item');
    const note = this.#notes.find((listEl) => listEl.id === el.dataset.id);
    note.title = el.querySelector('.form__title').value;
    note.text = el.querySelector('.form__text').value;

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

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }

  _animateButton() {
    const iconPlus = buttonCreateNewNote.querySelector('#icon__plus');
    iconPlus.classList.add('fade-out-in');
    buttonCreateNewNote.classList.add('hover');
    setTimeout(() => {
      iconPlus.classList.remove('fade-out-in');
      buttonCreateNewNote.classList.remove('hover');
    }, 500);
  }

  _getRandomBackgroundColor(min, max) {
    const colors = [
      '#FAE283',
      '#D19AC8',
      '#71CECC',
      '#87CC3A',
      '#FA742B',
      '#C7B287',
    ];

    const number = Math.floor(Math.random() * (max - min) + min);
    return colors[number];
  }

  // _resizeTextArea(textarea) {
  //   textarea.addEventListener('keyup', (e) => {
  //     const scrlHeight = e.target.scrollHeight;
  //     textarea.style.height = '110px';
  //     textarea.style.height = `${scrlHeight}px`;
  //   });
  // }
}

const app = new App();
