


class Note {
    date = new Date();

    id = `${new Date().getTime()}`.slice(-10);

    constructor(title, text) {
        this.title = title  // input title
        this.text = text // input text
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
        const note = new Note();

        // insert a note to input form
        // this._editNote(note)
        // add new note to notes
        this.#notes.push(note);


        // Animate button
        this._animateButton()
        // add data to local storage
        // this._setLocalStorage()
        console.log(this.#notes);
        this._renderFormInputItem(note)


    }

    _handleModalNote() {

    }

    // _editNote(note) {
    //     const html = `
    //     <button class='button form__button--escape'>X</button>
    //     <input name="searchTxt" type="text" class="form__title" placeholder="Title..." value="${!note.title ? '' : note.title}">
    //     <textarea
    //     name=""
    //     class="form__main-text"
    //     required=""
    //     cols="40"
    //     rows="15"
    //      placeholder="Text..."
    //     >${!note.text ? '' : note.text}</textarea>
    //     <button class="button form__button" type="submit">save
    //     </button>
    //     `




    // }

    _renderListItem(note) {
        const html = `<li class="list__item" data-id="${note.id}">
        <form class="form" name="notes__form">
            <button class='button form__button--escape'>X</button>
            <input name="searchTxt" type="text" class="form__title" placeholder="Title..." value="${!note.title ? '' : note.title}">
            <textarea
            name=""
            class="form__text"
            required=""
            cols="15"
            rows="2"
             placeholder="Text..."
            >${!note.text ? '' : note.text}</textarea>

        </form>
        </li>`;

        listItems.insertAdjacentHTML('afterbegin', html);
        // modalInput.insertAdjacentHTML('afterbegin', html);
        // modalContainer.classList.remove('hide');

    }





    _renderFormInputItem(note) {
        const html = `<li class="list__item" data-id="${note.id}">
        <form class="form" name="notes__form">
            <button class='button form__button--escape'>X</button>
            <input name="searchTxt" type="text" class="form__title" placeholder="Title..." value="${!note.title ? '' : note.title}">
            <textarea
            name=""
            class="form__text"
            required=""
            cols="15"
            rows="2"
             placeholder="Text..."
            >${!note.text ? '' : note.text}</textarea>
            <button class="button form__button" type="submit">save
            </button>
        </form>
        </li>`;

        // listItems.insertAdjacentHTML('afterbegin', html);
        modalInput.insertAdjacentHTML('afterbegin', html);
        modalContainer.classList.remove('hide');

    }

    // _renderTexttoItemList(note){
    //     const html = `
    //     <li>${note.title}</li>
    //     `
    //     listItems.insertAdjacentHTML('afterbegin', html);
    // }

    _clearInput() {
        formTitle = '';
    }

    _handleNote(e) {
        e.preventDefault();
        if (e.target.classList.contains('form__button')) {
            this._saveSelectedNote(e);

                   console.log(this.#notes);
        }
        if (e.target.classList.contains('form__button--escape')) {
            this._deleteSelectedNote(e)
        }
    }

    _saveSelectedNote(e) {
            const el = e.target.closest('.list__item');
            const note = this.#notes.find(listEl => listEl.id === el.dataset.id);
            note.title = el.querySelector('.form__title').value
            note.text = el.querySelector('.form__text').value

            modalInput.textContent = ''
            modalContainer.classList.add('hide');

            // this._renderTexttoItemList(note);
            this._renderListItem(note);

            if(note.title || note.text) {
                this._setLocalStorage();
            }

    }

    _deleteSelectedNote(e) {
            const el = e.target.closest('.list__item');
            // console.log(el);
            this.#notes.pop(listEl => listEl.id === el.dataset.id);
            // console.log(this.#notes);
            el.remove();
            this._setLocalStorage()
    }

    _setLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(this.#notes));
      }

      _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem('notes'));

        if (!data) return;

        this.#notes = data;

        this.#notes.forEach(note => {
          this._renderListItem(note);
        });
      }

      reset() {
        localStorage.removeItem('workouts');
        location.reload();
      }

      _animateButton() {
        const iconPlus = buttonCreateNewNote.querySelector("#icon__plus");
        iconPlus.classList.add('fade-out-in');
        buttonCreateNewNote.classList.add('hover');
        setTimeout(() => {
        iconPlus.classList.remove('fade-out-in');
        buttonCreateNewNote.classList.remove('hover');
        }, 500);
      }




}

const app = new App()

