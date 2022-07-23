const messageBar = document.querySelector('.message-container');
const deleteButton = document.querySelector('.delete-button');

deleteButton.addEventListener('click', () => {
    messageBar.remove();
});