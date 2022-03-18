


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
const buttonCreateNewNote = document.querySelector('.button--cta');
const buttonSaveNote = document.querySelector('.form__button');
const listItems = document.querySelector('.list__items');
let formTitle = document.querySelector('.form__title');
let formText = document.querySelector('.form__text');

class App {
    #notes = [];

    constructor() {
        buttonCreateNewNote.addEventListener('click', this._renderListItem.bind(this));
        buttonSaveNote.addEventListener('click', _saveNote.bind(this))
    }

    _renderListItem() {
        const html = `<li class="list_item">
        <form class="form" name="notes__form">
            <input type="text" class="form__title" placeholder="Title..." />
            <textarea
            name=""
            class="form__text"
            required=""
            cols="50"
            rows="10" placeholder="Text..."
            ></textarea>
            <button class="button form__button" tyoe="submit">Add Tassssk</button>
        </form>
        </li>`;
        listItems.insertAdjacentHTML('beforeend', html);


    }

    _saveNote() {
        const note = new Note(formTitle, formText);
        this.#notes.push(note);
        console.log(this.#notes);

        this._clearInput()
    }

    _clearInput() {
        formTitle = '';
    }
}

const app = new App()