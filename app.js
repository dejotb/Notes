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
const containerMain = document.querySelector('.container');
const containerSettings = document.querySelector('.container__settings');
const listItems = document.querySelector('.list__items');
const buttonCreateNewNote = document.querySelector('.button--cta');
const modalContainer = document.querySelector('.modal__container');
const modalInput = document.querySelector('.modal__input');
const buttonSettings = document.querySelector('.button__settings');
const buttonDeleteAll = document.querySelector('.button__settings--delete-all');
const settingsOptions = document.querySelector('.settings__options');

class App {
  #notes = [];

  constructor() {
    buttonCreateNewNote.addEventListener('click', this._newNote.bind(this));
    listItems.addEventListener('click', this._handleNote.bind(this));
    modalContainer.addEventListener('click', this._handleNote.bind(this));
    containerSettings.addEventListener(
      'click',
      this._handleSettings.bind(this)
    );

    // Get data from local storage
    this._getLocalStorage();

    // Show instruction
    this._handleInstructionText();
  }

  _newNote() {
    this._getLocalStorage();
    // create new note
    const note = new Note(this._getRandomColor());

    // Add new note to notes array
    this.#notes.push(note);

    // Render input form
    this._renderFormInputItem(note);

    // Animate new note button
    this._animateButton();

    console.log(this.#notes);

    containerMain.style.opacity = 0;

    if (document.querySelector('.instruction--create')) {
      document.querySelector('.instruction--create').remove();
    }
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
    modalContainer.classList.remove('hidden');
    this._handleInstructionText();
  }

  _handleNote(e) {
    e.preventDefault();

    if (e.target.classList.contains('modal__container')) {
      this._handleModalVisibility();
      this._handleInstructionText();
      this._getLocalStorage();
    }

    if (e.target.closest('.button__form--save--exit')) {
      this._saveSelectedNote();
      this._handleInstructionText();
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

      containerMain.style.opacity = 0;
      const note = this.#notes.find((listEl) => listEl.id === el.dataset.id);
      this._renderFormInputItem(note);
      if (note.title || note.text) {
        this._setLocalStorage();
      }
    }
  }

  _handleModalVisibility() {
    containerMain.style.opacity = 1;
    modalInput.textContent = '';
    listItems.textContent = '';
    // modalContainer.textContent = '';
    modalContainer.classList.add('hidden');
    if (!document.querySelector('.modal--alert')) return;
    document.querySelector('.modal--alert').remove();
  }

  _saveSelectedNote() {
    const el = modalInput.querySelector('.list__item');
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

    this._handleModalVisibility();
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
    containerMain.style.opacity = 1;

    this._setLocalStorage();
    modalInput.textContent = '';
    modalContainer.classList.add('hidden');

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

  _reset() {
    // this._getLocalStorage();
    // alert('are you sure you want to delete all notes?');
    modalContainer.classList.remove('hidden');
    const html = `<div class='modal--alert'>
    <p>Are you sure you want to delete all notes?</p>
    <button class='button--yes'>yes</button->
    <button class='button--no'>no</button->
    </div>`;
    modalContainer.insertAdjacentHTML('afterbegin', html);
    document.querySelector('.modal--alert').addEventListener('click', (e) => {
      if (e.target.classList.contains('button--yes')) {
        localStorage.removeItem('notes');
        location.reload();
        // this._setLocalStorage();
        console.log(e.target);
      }
      if (e.target.classList.contains('button--no')) {
        location.reload();
      }
    });
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

  _getRandomColor(min = 0) {
    const colors = [
      '250,226,131',
      '209,154,200',
      '113,206,204',
      '135,204,58',
      '199,178,135',
      '211,212,233',
      '241,207,48',
      '250,205,199',
    ];

    const max = colors.length;

    console.log(colors.length);

    const number = Math.floor(Math.random() * (max - min) + min);
    return colors[number];
  }

  _darkenRandomColor(inputColor, factor) {
    return `rgb(${inputColor
      .split(',')
      .map((color) => color - (255 - color) * factor)
      .join(',')})`;
  }

  _handleInstructionText() {
    if (this.#notes.length > 1) {
      return;
    }

    if (
      this.#notes.length === 1 &&
      document.querySelector('.list__item--input')
    ) {
      const instructionInputForm = document.querySelector('.list__item--input');
      this._renderInstructionText('save', instructionInputForm);
      this._renderInstructionText('delete', instructionInputForm);
    }

    if (
      this.#notes.length === 1 &&
      document.querySelector('.list__item--rendered')
    ) {
      const instructionEdit = document.querySelector('.list__item--rendered');
      this._renderInstructionText('edit', instructionEdit);
    }

    if (this.#notes.length === 0) {
      this._renderInstructionText('create', document.body);
    }
  }

  _renderInstructionText(img, DOMelement) {
    setTimeout(() => {
      const html = `
        <div class="instruction--${img}">
        <img src="img/instruction__arrow--${img}.png" alt="instruction" />
      </div>
        `;
      DOMelement.insertAdjacentHTML('afterbegin', html);
    }, 2000);
  }

  _handleSettings(e) {
    if (e.target.closest('.button__settings')) {
      buttonSettings.classList.toggle('rotate');
      // settingsOptions.classList.toggle('hidden');
      settingsOptions.classList.toggle('translateX');
    }
    if (e.target.closest('.button__settings--delete-all')) {
      this._reset();
    }
  }
}

const app = new App();
