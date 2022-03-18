


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
let formTitle, formText = ''

class App {
    #notes = [];

    constructor() {
        buttonCreateNewNote.addEventListener('click', this._renderListItem.bind(this));

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
            <button class="button form__button" tyoe="submit">Save Task</button>
        </form>
        </li>`;

        listItems.insertAdjacentHTML('beforeend', html);

        formTitle = document.querySelector('.form__title');
        formText = document.querySelector('.form__text');

        this._saveNote()
    }

    _saveNote() {
        const note = new Note(formTitle.value, formText.value);
                console.log(note.text ='lol');
                this.#notes.push(note);
                console.log(this.#notes);



    }

    _clearInput() {
        formTitle = '';
    }
}

const app = new App()