


class Task {
    constructor() {

    }


}


class App {


    _renderListItem() {

    }
}


// APPLICATION ARCHITECTURE
const container = document.querySelector('.container');
const button = document.querySelector('.list__button');
const listItems = document.querySelector('.list__items');
let inputText = document.querySelector('.list__input');



function renderListItem() {
    button.addEventListener('click', function(e) {
        console.log(e.target);
        const html = `<li>${inputText.value}</li>`;
        listItems.insertAdjacentHTML('beforeend', html);
        clearInput()
    })
}

function clearInput() {
    inputText.value = '';
}

renderListItem()