


class Task {
    constructor() {

    }


}





// APPLICATION ARCHITECTURE
const container = document.querySelector('.container');
const button = document.querySelector('.list__button');
const listItems = document.querySelector('.list__items');
let inputText = document.querySelector('.list__input');

class App {
    #tasks =[];

    constructor() {
        button.addEventListener('click', this._renderListItem)
    }

    _renderListItem() {
        const html = `<li>${inputText.value}</li>`;
        listItems.insertAdjacentHTML('beforeend', html);

        this._clearInput()
    }

    clearInput() {
        inputText.value = '';
    }
}

