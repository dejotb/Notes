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
const modalContainer = document.querySelector('.container__modal');
const modalInput = document.querySelector('.modal__input');
const listItems = document.querySelector('.list__items');
const buttonCreateNewNote = document.querySelector('.button--cta');
const buttonSettings = document.querySelector('.button__settings');
const settingsOptions = document.querySelector('.settings__options');

class App {
  #notes = [];

  #themeColor = '#0074d9';

  constructor() {
    buttonCreateNewNote.addEventListener('click', this._newNote.bind(this));
    listItems.addEventListener('click', this._handleNote.bind(this));
    modalContainer.addEventListener('click', this._handleNote.bind(this));
    containerSettings.addEventListener(
      'click',
      this._handleSettings.bind(this)
    );

    // Get data from local storage
    this._getLocalStorageNotes();
    this._getLocalStorageTheme();

    // set theme based on information from local storage
    document.documentElement.style.setProperty(
      '--color-theme',
      this.#themeColor
    );

    // Show instruction
    this._handleInstructionText();
  }

  _newNote() {
    // Create new note
    const note = new Note(this._getRandomColor());

    // Add new note to notes array
    this.#notes.push(note);

    // Render input form
    this._renderFormInputItem(note);

    // Remove pin button from new form input
    this._removePinButton();

    // Animate new note button
    this._animateButton();

    containerMain.style.opacity = 0;

    if (!document.querySelector('.instruction--create')) {
      return;
    }
    document.querySelector('.instruction--create').remove();
  }

  // Remove pin button from new form input
  _removePinButton() {
    const container = document.querySelector('.list__item--input');
    const element = container.querySelector('.button__form--pin');

    element.remove();
  }

  // Render list item
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

  // renders input item
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
        <button class="button__form--pin">pin</button>
      </li>`;

    modalInput.insertAdjacentHTML('afterbegin', html);
    modalContainer.classList.remove('hidden');
    this._handleInstructionText();
  }

  // checks what to do with a clicked part of a note
  _handleNote(e) {
    if (
      e.target.classList.contains('container__modal') ||
      e.target.closest('.button__alert--save--exit')
    ) {
      this._handleModalVisibility();
      this._handleInstructionText();
      this._getLocalStorageNotes();
    }

    if (e.target.closest('.button__form--save--exit')) {
      this._saveSelectedNote();
      this._handleInstructionText();
    }

    if (e.target.closest('.button__form--delete')) {
      this._deleteSelectedNote(e);
      this._setLocalStorage('notesOrder', listItems.innerHTML);
    }
    if (e.target.closest('.button__form--pin')) {
      this._pinSelectedNote(e);
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
        this._setLocalStorage('notes', this.#notes);
      }
    }
  }

  // handles visibility of a modal
  _handleModalVisibility() {
    containerMain.style.opacity = 1;
    modalInput.textContent = '';
    listItems.textContent = '';
    modalContainer.classList.add('hidden');
    if (!document.querySelector('.modal__alert')) return;
    document.querySelector('.modal__alert').remove();
  }

  // saves selected note
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
      this._setLocalStorage('notes', this.#notes);
    }

    this._handleModalVisibility();
    this._getLocalStorageNotes();

    // check if a note is already rendered in the DOM
    if ([...listItems.children].some((listEl) => listEl.dataset.id === note.id))
      return;

    this._renderListItem(note);
  }

  // deletes a note
  _deleteSelectedNote(e) {
    const el = e.target.closest('.list__item');
    const elId = listItems.querySelector(`[data-id='${el.dataset.id}']`);
    this.#notes = this.#notes.filter((listEl) => listEl.id !== el.dataset.id);
    containerMain.style.opacity = 1;

    this._setLocalStorage('notes', this.#notes);
    modalInput.textContent = '';
    modalContainer.classList.add('hidden');

    if (!elId) return;
    elId.remove();
  }

  _pinSelectedNote(e) {
    const el = e.target.closest('.list__item');
    const activeEl = listItems.querySelector(`[data-id='${el.dataset.id}']`);
    // console.log(activeEl);
    const activeElId = activeEl.getAttribute('data-id');
    listItems.insertAdjacentElement('afterbegin', activeEl);

    containerMain.style.opacity = 1;

    // console.log(this.#notes);

    const pinnedEl = this.#notes.filter((ele) => ele.id === activeElId);
    // console.log(pinnedEl);

    const indexOfActiveElInArray = this.#notes.findIndex(
      (item) => item.id === activeElId
    );

    this.#notes.splice(indexOfActiveElInArray, 1);

    // console.log(this.#notes);

    this.#notes.push(...pinnedEl);
    // console.log(this.#notes);
    this._setLocalStorage('notes', this.#notes);
  }

  _setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  _getLocalStorageNotes() {
    const data = JSON.parse(localStorage.getItem('notes'));

    if (!data) return;

    this.#notes = data;

    this.#notes.forEach((note) => {
      this._renderListItem(note);
    });
  }

  _getLocalStorageTheme() {
    const data = JSON.parse(localStorage.getItem('theme'));

    if (!data) return;

    return (this.#themeColor = data);
  }

  // deletes notes from a notes array and a local storage
  _reset() {
    modalContainer.classList.remove('hidden');
    const html = `
    <div class='modal__alert'>
      <p>Are you sure you want to delete all notes?</p>
      <div class='alert__buttons'>
        <button class='button--yes'>yes</button->
        <button class='button--no'>no</button->
      </div>
    </div>`;
    modalContainer.insertAdjacentHTML('afterbegin', html);
    document.querySelector('.modal__alert').addEventListener('click', (e) => {
      if (e.target.classList.contains('button--yes')) {
        localStorage.removeItem('notes');
        location.reload();
      }
      if (e.target.classList.contains('button--no')) {
        location.reload();
      }
    });
  }

  // animates add button on click
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

    const number = Math.floor(Math.random() * (max - min) + min);
    return colors[number];
  }

  _darkenRandomColor(inputColor, factor) {
    return `rgb(${inputColor
      .split(',')
      .map((color) => color - (255 - color) * factor)
      .join(',')})`;
  }

  // handles instructions visibility
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

  // renders instruction arrows
  _renderInstructionText(img, DOMelement) {
    setTimeout(() => {
      const html = `
        <div class="instruction--${img}">
          <img src="img/instruction__arrow--${img}.png" alt="instruction" />
        </div>
        `;
      DOMelement.insertAdjacentHTML('afterbegin', html);
    }, 500);
  }

  // handles app settings - delete all button
  _handleSettings(e) {
    if (e.target.closest('.button__settings') || e.target.closest('.setting')) {
      buttonSettings.classList.toggle('rotate');
      settingsOptions.classList.toggle('translateX');
    }
    if (e.target.closest('.button__settings--delete-all')) {
      this._reset();
    }
    if (e.target.closest('.button__settings--theme')) {
      this._renderThemeSelectionHTML();
      this._changeTheme();
    }
    if (e.target.closest('.button__quote')) {
      this._generateQuote();
    }
  }

  _renderThemeSelectionHTML() {
    modalContainer.classList.remove('hidden');
    const html = `
    <div class='modal__alert'>
    <button class="button button__alert--save--exit" type="submit" title="save"> <img src="img/arrow.svg" alt="save note"></button>
      <fieldset>
        <legend>Select a theme:</legend>
        <div class='theme__option'>
          <input type="radio" id="amazon-morning" name="theme" value="amazon-morning"
                checked>
          <label for="amazon-morning">Amazon Morning</label>
        </div>
        <div class='theme__option'>
          <input type="radio" id="young-banana" name="theme" value="young-banana">
          <label for="young-banana">Young Banana</label>
        </div>
        <div class='theme__option'>
          <input type="radio" id="whole-green" name="theme" value="whole-green">
          <label for="whole-green">Whole Green</label>
        </div>
      </fieldset>
    </div>`;
    modalContainer.insertAdjacentHTML('afterbegin', html);
  }

  _changeTheme() {
    const formTheme = document.querySelector('fieldset');
    formTheme.addEventListener('click', (e) => {
      if (e.target.closest('.theme__option'));
      const selectedThemeOption = [...document.querySelectorAll('input')].find(
        (el) => el.checked
      );

      if (selectedThemeOption.value === 'amazon-morning') {
        this.#themeColor = '#0074d9';
        document.documentElement.style.setProperty(
          '--color-theme',
          this.#themeColor
        );
      }

      if (selectedThemeOption.value === 'young-banana') {
        this.#themeColor = '#ccae62';
        document.documentElement.style.setProperty(
          '--color-theme',
          this.#themeColor
        );
      }

      if (selectedThemeOption.value === 'whole-green') {
        this.#themeColor = '#218c74';
        document.documentElement.style.setProperty(
          '--color-theme',
          this.#themeColor
        );
      }

      this._setLocalStorage('theme', this.#themeColor);
    });
  }

  async _generateQuote() {
    try {
      const data = await fetch(`https://api.goprogram.ai/inspiration`);
      const result = await data.json();
      const html = `
      <div class='modal__alert'>
      <button class="button button__alert--save--exit" type="submit" title="save"> <img src="img/arrow.svg" alt="save note"></button>
      <p>Quote for today is:</p>
      <p class="quote">„${result.quote}”
      <span class="quote__author">${result.author}</span>
      </p>
      </div>`;
      modalContainer.classList.remove('hidden');
      modalContainer.insertAdjacentHTML('afterbegin', html);
    } catch (err) {
      alert(err);
    }
  }
}

const app = new App();
