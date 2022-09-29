var searchBar = document.querySelector('.searchbar-input');
var items = document.querySelectorAll('.item');

searchBar.addEventListener('keyup', () => {
    var searchBarInput = searchBar.value;

    for (i = 0; i < items.length; i++) {
        if (items[i].querySelector('h2').innerText.includes(searchBarInput)) {
            items[i].style.display = 'flex';
        } else {
            items[i].style.display = 'none';
        };
    };
});