var forms = document.querySelectorAll('form');
var anchors = document.querySelectorAll('a');
var loadingScreen = document.querySelector('.loading-screen');

for (i = 0; i < forms.length; i++) {
    forms[i].addEventListener('submit', () => {
        loadingScreen.classList.remove('hide');
    });   
}

for (i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener('click', () => {
        loadingScreen.classList.remove('hide');
    });   
}