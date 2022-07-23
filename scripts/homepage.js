// SET VARIABLES
var gameStarted = false;
var questionNumber = 0;
var currentScore = 0;
var numberOfQuestions = 5;

// DEFINE HTML ELEMENTS
var practiceInterface = document.querySelector('.practice-interface');
var questionDisplay = document.querySelector('.question-display');
var answerDisplay = document.querySelector('.answer-display');
var scoreDisplay = document.querySelector('.score-display');
var vocabDisplay = document.querySelector('.vocab-display');
var answerButtons = document.querySelectorAll('.answer-choice');
var startButton = document.querySelector('.start-button');
var skipButton = document.querySelector('.skip-button');
var nextButton = document.querySelector('.next-button');
var replayButton = document.querySelector('.replay-button');

// REQUIRE QUESTIONS DATA FROM DATABASE
let questions;
getData();

async function getData() {
    const data = await fetch('/getDatabaseData');
    const parsedData = await data.json();
    questions = parsedData;
};

// SEND VOCAB SCORES TEST
async function sendData() {
    console.log(questions);
    fetch('/sendDatabaseData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(questions)
    });
};


// FUNCTIONS //

// ORDER QUESTIONS BY SKILL LEVEL
async function orderQuestions() {
    // Not sure I understand this
    questions.sort(function(a, b) {
        return parseFloat(a.level) - parseFloat(b.level);
    });
};

// SHUFFLE QUESTIONS
async function shuffleQuestions() {

    // Shuffle Question Order
    for (i = questions.length - 1; i > 0; i--) {
        var randomNumber = Math.floor(Math.random() * (i + 1));
        var indexItem = questions[i];
        questions[i] = questions[randomNumber];
        questions[randomNumber] = indexItem;

        // Shuffle Answer Order
        var currentQuestion = questions[i];
        for (j = currentQuestion.answers.length - 1; j > 0; j--) {
            var randomNumber = Math.floor(Math.random() * (j + 1));
            var indexItem = currentQuestion.answers[j];
            currentQuestion.answers[j] = currentQuestion.answers[randomNumber];
            currentQuestion.answers[randomNumber] = indexItem;
        };
    };
};

// START GAME
async function startGame() {
    // Shuffle Questions
    await shuffleQuestions();
    await orderQuestions();

    // Add data to display
    questionDisplay.innerText = questions[0].kanji;
    for (i = 0; i < questions[0].answers.length; i++) {
        answerButtons[i].innerText = questions[0].answers[i];
    }

    // Reset previous interface
    var vocabDisplay = document.querySelector('.vocab-display');
    if (vocabDisplay) {
        vocabDisplay.remove();
    }

    replayButton.classList.add('hide');
    scoreDisplay.classList.add('hide');

    // Show new interface
    startButton.classList.add('hide');
    questionDisplay.classList.remove('hide', 'correct', 'incorrect');
    answerDisplay.classList.remove('hide');
    skipButton.classList.remove('hide');
    nextButton.innerText = 'Next Question';

    for (i = 0; i < answerButtons.length; i++) {
        answerButtons[i].classList.remove('hide');
        answerButtons[i].disabled = false;
    };

    // Reset game conditions
    gameStarted = true;
    questionNumber = 0;
    currentScore = 0;
}

// SHOW SCORE
function showScore() {
    // Send score to server
    sendData();

    // Remove game interface
    nextButton.classList.add('hide');
    skipButton.classList.add('hide');
    questionDisplay.classList.add('hide');
    answerDisplay.classList.add('hide');
    for (i = 0; i < answerButtons.length; i++) {
        answerButtons[i].classList.add('hide');
    };

    scoreDisplay.classList.remove('hide');
    replayButton.classList.remove('hide');

    scoreDisplay.innerText = currentScore + " / " + numberOfQuestions;

    // Show player vocabulary levels
    // Create container
    const vocabDisplay = document.createElement('div');
    for (i = 0; i < numberOfQuestions; i++) {
        // Create elements
        const vocabItem = document.createElement('div');
        const vocabKanji = document.createElement('div');
        const vocabEnglish = document.createElement('div');
        const vocabScore = document.createElement('div');

        // Add classes
        vocabDisplay.classList.add('vocab-display');
        vocabItem.classList.add('vocab-item');

        // Add data
        vocabKanji.innerText = questions[i].kanji;
        vocabEnglish.innerText = questions[i].english;
        vocabScore.innerText = questions[i].level + " / 10";

        // Append items to container
        vocabItem.appendChild(vocabKanji);
        vocabItem.appendChild(vocabEnglish);
        vocabItem.appendChild(vocabScore);

        vocabDisplay.appendChild(vocabItem);

        practiceInterface.appendChild(vocabDisplay);
    };
};

// NEXT QUESTION
async function nextQuestion() {
    if (questionNumber < numberOfQuestions - 1) {
        nextButton.classList.add('hide');
        skipButton.classList.remove('hide');
        await questionNumber++;
        questionDisplay.classList.remove('correct', 'incorrect');
        questionDisplay.innerText = questions[questionNumber].kanji;
    
        for (i = 0; i < questions[questionNumber].answers.length; i ++) {
            answerButtons[i].innerText = questions[questionNumber].answers[i];
        };
    
        for (i = 0; i < answerButtons.length; i++) {
            answerButtons[i].disabled = false;
        };

        if (questionNumber === (numberOfQuestions - 1)) {
            nextButton.innerText = 'Finish';
        };

    } else {
        showScore();
    };
}

// EVENT LISTENERS //

// START BUTTON
startButton.addEventListener('click', () => {
    startGame();
});

// NEXT BUTTON
nextButton.addEventListener('click', () => {
    nextQuestion();
});

// SKIP BUTTON
skipButton.addEventListener('click', () => {
    nextQuestion();
});

// REPLAY BUTTON
replayButton.addEventListener('click', () => {
    startGame();
});

// ANSWER BUTTONS
for (let i = 0; i < answerButtons.length; i++) {
    answerButtons[i].addEventListener('click', () => {
        if (answerButtons[i].innerText === questions[questionNumber].english) {
            questionDisplay.classList.add('correct');
            currentScore++;
            questions[questionNumber].level++;
        } else {
            questionDisplay.classList.add('incorrect');
        }

    for (let i = 0; i < answerButtons.length; i++) {
        answerButtons[i].disabled = true;
    };

    skipButton.classList.add('hide');
    nextButton.classList.remove('hide');
    });
};


// SEND VOCAB SCORES TO SERVER
async function sendData() {
    fetch('/sendDatabaseData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(questions)
    });
};