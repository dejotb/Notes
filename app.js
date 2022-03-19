


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


class App {
    #notes = [];

    constructor() {
        buttonCreateNewNote.addEventListener('click', this._newNote.bind(this));
        listItems.addEventListener('click', this._saveSelectedNote.bind(this));
        listItems.addEventListener('click', this._deleteSelectedNote.bind(this));
    }

    _newNote() {
        // create new note
        const note = new Note();
        this._renderListItem(note)

        // add new note to notes
        this.#notes.push(note);
        console.log(this.#notes);

        // save filled inputs


    }

    _renderListItem(note) {
        const html = `<li class="list_item" data-id="${note.id}">
        <form class="form" name="notes__form">
            <button class='button form__button--escape'>X</button>
            <input name="searchTxt" type="text" class="form__title" placeholder="Title...">
            <textarea
            name=""
            class="form__text"
            required=""
            cols="50"
            rows="10" placeholder="Text..."
            ></textarea>
            <button class="button form__button" type="submit">Save Task</button>
        </form>
        </li>`;

        listItems.insertAdjacentHTML('beforeend', html);

    }



    _clearInput() {
        formTitle = '';
    }

    _saveSelectedNote(e) {
        e.preventDefault();
        if (e.target.classList.contains('form__button')) {
            const el = e.target.closest('.list_item');

            const note = this.#notes.find(listEl => listEl.id === el.dataset.id);

            note.title = el.querySelector('.form__title').value
            note.text = el.querySelector('.form__text').value
            console.log(note);
        }
        console.log(this.#notes);
    }

    _deleteSelectedNote(e) {
        e.preventDefault();
        if (e.target.classList.contains('form__button--escape')) {
            const el = e.target.closest('.list_item');

            this.#notes.pop(listEl => listEl.id === el.dataset.id);
            console.log(this.#notes);
        }
    }
}

const app = new App()