const menuOpenButton = document.querySelector('.hamburger');
const menu = document.querySelector('.navbar-links');

menuOpenButton.addEventListener('click', () => {
    if (menu.style.display === "none") {
        menu.style.display = "flex";
    } else {
        menu.style.display = "none";
    };
});