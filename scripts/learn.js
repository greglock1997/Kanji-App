// INITIAL VARIABLES //
let userData = getData();
var newItems = [];
var numberOfNewItems = 5;
var newItemsCounter = 0;
var practiceItems = [];
var numberOfPracticeItems = 10;
var practiceItemsCounter = 0;
var questionCounter = 0;

// DOM ELEMENTS //
var learningInterface = document.querySelector('.learning-interface');
var practiceInterface = document.querySelector('.practice-interface');
var progressInterface = document.querySelector('.progress-interface');
var startLearningButton = document.querySelector('.start-learning-button');
var gotitButton = document.querySelector('.gotit-button');
var practiceButton = document.querySelector('.practice-button');
var vocabCard = document.querySelector('.vocab-card');
var kanjiDisplay = document.querySelector('.kanji-display');
var englishDisplay = document.querySelector('.english-display');
var questionDisplay = document.querySelector('.question-display');
var progressDisplay = document.querySelector('.progress-display');
var nextButton = document.querySelector('.next-button');
var skipButton = document.querySelector('.skip-button');
var finishButton = document.querySelector('.finish-button');
var answerButtons = document.querySelectorAll('.answer-choice');
var learnMoreButton = document.querySelector('.learn-more-button');
var practiceAgainButton = document.querySelector('.practice-again-button');

// API FUNCTIONS //

// REQUIRE QUESTIONS DATA FROM DATABASE
async function getData() {
    const data = await fetch('/getDatabaseData');
    const parsedData = await data.json();
    questions = parsedData;
    userData = questions;
};

// SEND VOCAB SCORES TO SERVER
async function saveData() {
    fetch('/sendDatabaseData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    console.log('Data Saved');
};

// CREATING DECK FUNCTIONS //

// MAKE NEW DECK
function makeNewDeck() {
    // Delete original
    newItems = [];

    // Set a counter
    var counter = 0;

    // Create new deck
    for (i = 0; i < userData.length; i++) {
        if (counter < numberOfNewItems) {
            if (userData[i].learned == false) {
                newItems.push(userData[i]);
                counter++;
            };
        };
    };

    // Shuffle items for randomness
    newItems = shuffleDeck(newItems);

    return newItems;
};

// MAKE PRACTICE DECK
async function makePracticeDeck() {
    // Delete original items
    practiceItems = [];

    // If this is the first time practicing after being introduced to
    // new items, include them in this practice
    if (firstTime() == true) {
        practiceItems = newItems;
    } else if (firstTime() == false) {
        if (newItems.length > 0) {
            console.log("newItems");
            practiceItems = newItems;

            // Add new items
            // Prevent duplication
            while (practiceItems.length < numberOfPracticeItems) {
                for (i = 0; i < userData.length; i++) {
                    if (userData[i].learned == true) {
                        var isDuplicate = false;

                        for(j = 0; j < practiceItems.length; j++) {
                            if (userData[i] === practiceItems[j]) {
                                isDuplicate = true;
                            };
                        };

                        if (isDuplicate === false) {
                            practiceItems.push(userData[i]);
                        };
                    };
                };
            };
        } else {
            for (i = 0; i < userData.length; i++) {
                if(practiceItems.length < numberOfPracticeItems) {
                    if (userData[i].learned == true) {
                        practiceItems.push(userData[i]);
                    };
                };
            };
        };
    };

    // Shuffle the items to make the order random
    practiceItems = shuffleDeck(practiceItems);
};

// CHECK FOR FIRST TIME PRACTICING
function firstTime() {
    var counter = 0;

    for (i = 0; i < userData.length; i++) {
        if (userData[i].learned == true) {
            counter++;
        };
    };


    if (counter < 10) {
        numberOfPracticeItems = 5;
        console.log("First time");
        return true;
    } else {
        console.log("Not first time");
        return false;
    };
};

// CHECK ITEM DOESN'T ALREADY EXIST IN ARRAY
function checkForDuplicate(array, item) {
    for (j = 0; j < array.length; j++) {
        if ((array[j] == item)) {
            return true;
        };
    };
}; 

// SORT DECK BY LEVEL
function sortDeck(deck) {
    deck.sort(function(a, b) {
        return parseFloat(a.level) - parseFloat(b.level);
    });
    return deck;
};

// RANDOMLY SHUFFLE DECK
function shuffleDeck(deck) {
        // Shuffle Question Order
        for (i = deck.length - 1; i > 0; i--) {
            var randomNumber = Math.floor(Math.random() * (i + 1));
            var indexItem = deck[i];
            deck[i] = deck[randomNumber];
            deck[randomNumber] = indexItem;
    
            // Shuffle Answer Order
            var currentItem = deck[i];
            for (j = currentItem.answers.length - 1; j > 0; j--) {
                var randomNumber = Math.floor(Math.random() * (j + 1));
                var indexItem = currentItem.answers[j];
                currentItem.answers[j] = currentItem.answers[randomNumber];
                currentItem.answers[randomNumber] = indexItem;
            };
        };
    return deck;
};

// UPDATE USER DATA
async function updateData(newData) {
    for (i = 0; i < newData.length; i++) {
        for (j = 0; j < userData.length; j++) {
            if (newData[i].english === userData[j].english) {
                userData[j].level = newData[i].level;
                userData[j].learned = newData[i].learned;
            };
        };
    };
};

// RESET INTERFACE CLASSES
function resetInterfaceClasses() {
    skipButton.classList.remove('hide');
    nextButton.classList.add('hide');

    for (i = 0; i < answerButtons.length; i++) {
        answerButtons[i].classList.remove('correct', 'incorrect');
        answerButtons[i].disabled = false;
    };
};

// BUTTON EVENT LISTENERS //

// START LEARNING BUTTON
startLearningButton.addEventListener('click', () => {
    // Reset new items counter
    newItemsCounter = 0;

    sortDeck(userData);
    makeNewDeck();

    // Check to see if there is new vocabulary to introduce
    if (newItems.length > 0) {
        // Change interface
        startLearningButton.classList.add('hide');
        gotitButton.classList.remove('hide');
        vocabCard.classList.remove('hide');

        // Set vocabulary
        kanjiDisplay.innerText = newItems[0].kanji;
        englishDisplay.innerText = newItems[0].english;

        // Update level
        for (i = 0; i < userData.length; i++) {
            if (userData[i].english === newItems[0].english) {
                userData[i].learned = true;
            };
        };

        // Move to next item
        //  newItemsCounter++;
    } else {
        startLearningButton.classList.add('hide');
        practiceButton.classList.remove('hide');
    };
});

// GOTIT BUTTON
gotitButton.addEventListener('click', () => {

    // Check if the number of items left to introduce is
    // less than the default numberOfNewItems
    if (newItems.length < numberOfNewItems) {
        numberOfNewItems = newItems.length;
    };

    // Check how many new items there are to introduce left
    // if this is the last item, change the button to practice button
    if (newItemsCounter < (newItems.length - 1)) {

        // Update current item level
        newItems[newItemsCounter].learned = true;

        for (i = 0; i < userData.length; i++) {
            if (userData[i].english === newItems[newItemsCounter].english) {
                userData[i].learned = true;
            };
        };

        // Move to next item
        newItemsCounter++;

        // Update to new item
        kanjiDisplay.innerText = newItems[newItemsCounter].kanji;
        englishDisplay.innerText = newItems[newItemsCounter].english;

    } else {
        // Update current item level
        newItems[newItemsCounter].learned = true;

        for (i = 0; i < userData.length; i++) {
            if (userData[i].english === newItems[newItemsCounter].english) {
                userData[i].learned = true;
            };
        };

        // Remove gotitButton, replace with practice button
        gotitButton.classList.add('hide');
        practiceButton.classList.remove('hide');
    };
});

// START PRACTICE BUTTON
practiceButton.addEventListener('click', () => {
    // Save data
    saveData();

    // If this is their first time, shorten the practice to only 5 items
    var numberOfIntroducedItems = 0;
    for (i = 0; i < userData.length; i++) {
        if (userData[i].learned == true) {
            numberOfIntroducedItems++;
        };
    };

    if (numberOfIntroducedItems <= numberOfNewItems) {
        numberOfPracticeItems = numberOfIntroducedItems;
    };

    // Make a practice deck
    makePracticeDeck();

    // Set interface
    setPracticeInterface();
});

// ANSWER BUTTONS
for (let i = 0; i < answerButtons.length; i++) {
    answerButtons[i].addEventListener('click', () => {
        // Check to see if user has chosen the correct answer
        if (answerButtons[i].innerText === practiceItems[questionCounter].english) {
            answerButtons[i].classList.add('correct');
            practiceItems[questionCounter].level++;
        } else {
        // If not, show them the correct answer
            answerButtons[i].classList.add('incorrect');
            for (j = 0; j < answerButtons.length; j++) {
                if (answerButtons[j].innerText === practiceItems[questionCounter].english) {
                    answerButtons[j].classList.add('correct');
                };
            };
        };

        // Disable all buttons
        for (let i = 0; i < answerButtons.length; i++) {
            answerButtons[i].disabled = true;
        };

        // Check for final question
        if (questionCounter < (numberOfPracticeItems - 1)) {
            // Remove skip button add next button
            skipButton.classList.add('hide');
            nextButton.classList.remove('hide');

            // Update question counter
            questionCounter++;
        } else {
            // Remove skip and next button, replace with finish button
            skipButton.classList.add('hide');
            nextButton.classList.add('hide');
            finishButton.classList.remove('hide');
        };
    });
};

// SKIP BUTTON
skipButton.addEventListener('click', () => {
    // Check for final question
    if (questionCounter < (numberOfPracticeItems - 1)) {
        // Reset interface classes
        resetInterfaceClasses();

        // Update question counter
        questionCounter++;

        // Update question and answers
        questionDisplay.innerText = practiceItems[questionCounter].kanji;
        for (i = 0; i < practiceItems[questionCounter].answers.length; i++) {
            answerButtons[i].innerText = practiceItems[questionCounter].answers[i];
        }; 
    } else {
        skipButton.classList.add('hide');
        finishButton.classList.remove('hide');
    };
});

// NEXT QUESTION BUTTON
nextButton.addEventListener('click', () => {
    // Reset interface classes
    resetInterfaceClasses();

    // Update question and answers
    questionDisplay.innerText = practiceItems[questionCounter].kanji;
    for (i = 0; i < practiceItems[questionCounter].answers.length; i++) {
        answerButtons[i].innerText = practiceItems[questionCounter].answers[i];
    };    
});

// FINISH BUTTON
finishButton.addEventListener('click', () => {
    // Update data
    for (i = 0; i < practiceItems.length; i++) {
        for (j = 0; j < userData.length; j++) {
            if (practiceItems[i].english === userData[j].english) {
                userData[j].level = practiceItems[i].level;
                userData[j].learned = practiceItems[i].learned;
            };
        };
    };

    // Then save data
    saveData();

    // Remove items from previous progress display
    progressDisplay.innerHTML = "";

    // If there are no new items to learn, remove 'Learn More' button
    /*
    var isNewItems = false;
    for (i = 0; i < userData.length; i++) {
        if (userData[i].level === 0) {
            isNewItems = true;
        };
    };

    if (isNewItems === false) {
        learnMoreButton.classList.add('hide');
    };
    */

    // Change interface
    practiceInterface.classList.add('hide');
    progressInterface.classList.remove('hide');

    // If the user has learned less than ten items remove the 'Practice again' button
    var numberOfIntroducedItems = 0;

    for (i = 0; i < userData.length; i++) {
        if (userData[i].learned == true) {
            numberOfIntroducedItems++;
        };
    };

    if (numberOfIntroducedItems < 10) {
        practiceAgainButton.classList.add('hide');
    } else if (numberOfIntroducedItems >= userData.length) {
        practiceAgainButton.classList.remove('hide');
        learnMoreButton.classList.add('hide');
    } else {
        practiceAgainButton.classList.remove('hide');
    };

    // Create score display
    for (i = 0; i < numberOfPracticeItems; i++) {
        // Create elements
        const progressDisplayItem = document.createElement('div');
        const progressDisplayItemEnglish = document.createElement('h3');
        const progressDisplayItemKanji = document.createElement('h3');
        const progressDisplayItemLevel = document.createElement('h3');

        progressDisplayItem.classList.add('progress-display-item');

        // Add data to elements
        progressDisplayItemEnglish.innerText = practiceItems[i].english;
        progressDisplayItemKanji.innerText = practiceItems[i].kanji;
        progressDisplayItemLevel.innerText = (practiceItems[i].level) + " / 10";

        // Add elements to container
        progressDisplayItem.appendChild(progressDisplayItemEnglish);
        progressDisplayItem.appendChild(progressDisplayItemKanji);
        progressDisplayItem.appendChild(progressDisplayItemLevel);

        // Add container to page
        progressDisplay.appendChild(progressDisplayItem);
    };
});

// LEARN MORE BUTTON
learnMoreButton.addEventListener('click', () => {
    resetData();
    setLearningInterface();
    newItemsCounter = 0;
});

practiceAgainButton.addEventListener('click', () => {
    // Delete newItems contents
    newItems = [];

    resetData();
    makePracticeDeck();
    setPracticeInterface();
});

// RESET DATA FUNCTION
async function resetData() {
    // await getData();
    userData = sortDeck(userData);
    numberOfNewItems = 5;
    newItemsCounter = 0;
    numberOfPracticeItems = 10;
    practiceItemsCounter = 0;
    questionCounter = 0;
};

// SET LEARNING INTERFACE
async function setLearningInterface() {
    // Remove progress interface
    progressInterface.classList.add('hide');

    // Remove items within progress interface
    progressDisplayItems = document.querySelectorAll('.progressDisplayItem');
    for (i = 0; i < progressDisplayItems.length; i++) {
        progressDisplayItems[i].remove();
    };

    // Show learning interface
    learningInterface.classList.remove('hide');

    // Reset buttons
    gotitButton.classList.remove('hide');
    practiceButton.classList.add('hide');

    // Create new vocabulary deck
    await sortDeck(userData);
    await makeNewDeck();

    newItems = newItems;

    // Check to see if there is new vocabulary to introduce
    if (newItems.length > 0) {
        // Change interface
        startLearningButton.classList.add('hide');
        gotitButton.classList.remove('hide');
        vocabCard.classList.remove('hide');

        // Set vocabulary
        kanjiDisplay.innerText = newItems[0].kanji;
        englishDisplay.innerText = newItems[0].english;

        // Move to next item
        // newItemsCounter++;
    };   
};

// SET PRACTICE INTERFACE
async function setPracticeInterface() {
    // First, hide learning and level interface
    learningInterface.classList.add('hide');
    progressInterface.classList.add('hide');

    // Show practice interface
    practiceInterface.classList.remove('hide');

    // Reset answer, skip, finish and next buttons
    for (i = 0; i < answerButtons.length; i++) {
        answerButtons[i].classList.remove('correct', 'incorrect');
        answerButtons[i].disabled = false;
    };

    nextButton.classList.add('hide');
    finishButton.classList.add('hide');
    skipButton.classList.remove('hide');

    // Set question and answer data
    questionDisplay.innerText = practiceItems[0].kanji;
    for (i = 0; i < practiceItems[0].answers.length; i++) {
        answerButtons[i].innerText = practiceItems[0].answers[i];
    };    
};

// TESTING FUNCTIONS //
function printData() {
    console.log(userData);
}

function editData() {
    for (i = 0; i < userData.length; i++) {
        userData[i].level = 1;
        userData[i].learned = true;
    };
};

function practiceData() {
    for (i = 0; i < 10; i++) {
        userData[i].level = 1;
        userData[i].learned = true;
    };
}

function setDataToZero() {
    for (i = 0; i < userData.length; i++) {
        userData[i].level = 0;
        userData[i].learned = false;
    };
}