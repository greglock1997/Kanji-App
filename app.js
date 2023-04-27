const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Vocab = require('./models/vocabulary.js');
const User = require('./models/user.js');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');


// CONNECT TO ONLINE DATABASE
const MongoDBStore = require("connect-mongo")(session)
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1/japaneseAppDatabase';

// var mongoDB = 'mongodb://127.0.0.1/japaneseAppDatabase';
mongoose.connect(dbUrl, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const secret = process.env.SECRET || 'catman';

const store = new MongoDBStore({
    url: dbUrl,
    secret: secret,
    touchAfter: 24 * 3600
});

store.on('error', function (e) {
    console.log("Session store error", e);
});

// SET VIEW ENGINE AS EJS
app.set('view engine', 'ejs');

// BODY PARSER
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// INCLUDE CSS AND JAVASCRIPT
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/scripts'));

// INCLUDE EXPRESS SESSION
function initilializeSession() {
    app.use(session({
        store: store,
        secret: secret,
        name: 'uniqueSessionID',
        saveUninitialized: false
    }));
};

initilializeSession();

// INCLUDE FLASH
app.use(flash());

// MAKE DATABASE ITEMS INTO AN ARRAY
let questions = [];

async function convertData(currentUsername) {
    // Username works but user doesn't?
    const data = await Vocab.find({user: currentUsername});
    for (i = 0; i < data.length; i++) {
        var question = {
            user: data[i].user,
            answers: data[i].answers,
            kanji: data[i].kanji,
            english: data[i].english,
            romaji: data[i].romaji,
            level: data[i].level,
            learned: data[i].learned
        };
        questions.push(question);
    };
};

// Make basic vocab items
let initialData = [
    {
        kanji: '人',
        english: 'Person',
        answers: [
            'Person',
            'Man',
            'Woman',
            'Child'
        ]
    },
    {
        kanji: '男',
        english: 'Man',
        answers: [
            'Person',
            'Man',
            'Woman',
            'Child'
        ]
    },
    {
        kanji: '女',
        english: 'Woman',
        answers: [
            'Person',
            'Man',
            'Woman',
            'Child'
        ]
    }, 
    {
        kanji: '子',
        english: 'Child',
        answers: [
            'Person',
            'Man',
            'Woman',
            'Child'
        ]
    },
    {
        kanji: '赤',
        english: 'Red',
        answers: [
            'Red',
            'Blue',
            'Green',
            'Yellow'
        ]
    },
    {
        kanji: '青',
        english: 'Blue',
        answers: [
            'Red',
            'Blue',
            'Green',
            'Yellow'
        ]
    },
    {
        kanji: '緑',
        english: 'Green',
        answers: [
            'Red',
            'Blue',
            'Green',
            'Yellow'
        ]
    },
    {
        kanji: '黄',
        english: 'Yellow',
        answers: [
            'Red',
            'Blue',
            'Green',
            'Yellow'
        ]
    },
    {
        kanji: '牛',
        english: 'Cow',
        answers: [
            'Cow',
            'Pig',
            'Sheep',
            'Horse'
        ]
    },
    {
        kanji: '豚',
        english: 'Pig',
        answers: [
            'Cow',
            'Pig',
            'Sheep',
            'Horse'
        ]
    },
    {
        kanji: '羊',
        english: 'Sheep',
        answers: [
            'Cow',
            'Pig',
            'Sheep',
            'Horse'
        ]
    },
    {
        kanji: '馬',
        english: 'Horse',
        answers: [
            'Cow',
            'Pig',
            'Sheep',
            'Horse'
        ]
    },
    {
        kanji: '一',
        english: 'One',
        answers: [
            'One',
            'Two',
            'Three',
            'Four'
        ]
    },
    {
        kanji: '二',
        english: 'Two',
        answers: [
            'One',
            'Two',
            'Three',
            'Four'
        ]
    },
    {
        kanji: '三',
        english: 'Three',
        answers: [
            'One',
            'Two',
            'Three',
            'Four'
        ]
    },  
    {
        kanji: '四',
        english: 'Four',
        answers: [
            'One',
            'Two',
            'Three',
            'Four'
        ]
    },
    {
        kanji: '五',
        english: 'Five',
        answers: [
            'Five',
            'Six',
            'Seven',
            'Eight'
        ]
    },
    {
        kanji: '六',
        english: 'Six',
        answers: [
            'Five',
            'Six',
            'Seven',
            'Eight'
        ]
    },
    {
        kanji: '七',
        english: 'Seven',
        answers: [
            'Five',
            'Six',
            'Seven',
            'Eight'
        ]
    },
    {
        kanji: '八',
        english: 'Eight',
        answers: [
            'Five',
            'Six',
            'Seven',
            'Eight'
        ]
    },
    {
        kanji: '九',
        english: 'Nine',
        answers: [
            'Nine',
            'Ten',
            'Eleven',
            'Twelve'
        ]
    }, 
    {
        kanji: '十',
        english: 'Ten',
        answers: [
            'Nine',
            'Ten',
            'Eleven',
            'Twelve'
        ]
    },
    {
        kanji: '左',
        english: 'Left',
        answers: [
            'Left',
            'Right',
            'Up',
            'Down'
        ]
    },
    {
        kanji: '右',
        english: 'Right',
        answers: [
            'Left',
            'Right',
            'Up',
            'Down'
        ]
    },  
    {
        kanji: '上',
        english: 'Up',
        answers: [
            'Left',
            'Right',
            'Up',
            'Down'
        ]
    },  
    {
        kanji: '下',
        english: 'Down',
        answers: [
            'Left',
            'Right',
            'Up',
            'Down'
        ]
    },
    {
        kanji: '水',
        english: 'Water',
        answers: [
            'Water',
            'Earth',
            'Fire',
            'Wind'
        ]
    },
    {
        kanji: '土',
        english: 'Earth',
        answers: [
            'Water',
            'Earth',
            'Fire',
            'Wind'
        ]
    },  
    {
        kanji: '火',
        english: 'Fire',
        answers: [
            'Water',
            'Earth',
            'Fire',
            'Wind'
        ]
    },  
    {
        kanji: '風',
        english: 'Wind',
        answers: [
            'Water',
            'Earth',
            'Fire',
            'Wind'
        ]
    }                     
];

// CREATE ADMIN DATA
app.get('/admin', async (res, req) => {
    for (i = 0; i < initialData.length; i++) {
        // Create new data with new username
        var newData = await new Vocab({
            user : "Admin",
            answers : initialData[i].answers,
            kanji : initialData[i].kanji,
            english : initialData[i].english,
            level : 0,
            learned : false
        });
        newData.save();
    };
});

// MAKE NEW VOCAB DATA FOR NEW USER
async function createVocabData(username) {
    // Find original template data
    var originalData = await Vocab.find({user: 'Admin'});
    for (i = 0; i < originalData.length; i++) {
        // Create new data with new username
        var newData = await new Vocab({
            user : username,
            answers : originalData[i].answers,
            kanji : originalData[i].kanji,
            english : originalData[i].english,
            romaji : originalData[i].romaji,
            level : 0,
            learned : false
        });
        newData.save();
    };
};


// LOGIN PAGE
app.get('/login', (req, res) => {
    // Log user out if already logged in
    if (req.session.loggedIn) {
        res.redirect('/logout');
    } else {
        res.render('login', { loggedIn : req.session.loggedIn, successMessage : req.flash('success'), errorMessage : req.flash('error') });
    };
});

app.post('/login', async (req, res) => {
    // Extract data from login form
    var { username, password } = req.body;

    // Find user in database
    var currentUser = await User.findOne({username: username});

    if (currentUser) {
        // Check for password match
        const passwordMatch = await bcrypt.compare(password, currentUser.password);
        if (passwordMatch) {
            await convertData(username);
            req.session.loggedIn = true;
            req.session.username = username;
            res.redirect('/learn');
        } else {
            req.flash('error', 'Incorrect username or password');
            res.redirect('/login');
        };
    } else {
        req.flash('error', 'Incorrect username or password');
        res.redirect('/login');
    };
}); 

// REGISTER PAGE
app.get('/register', (req, res) => {
    // Log current user out if already logged in
    if (req.session.loggedIn) {
        res.redirect('/logout');
    } else {
        res.render('register', { loggedIn : req.session.loggedIn, successMessage : req.flash('success'), errorMessage : req.flash('error')});
    };
});

app.post('/register', async (req, res) => {
    // Extract data from register form
    var { registerUsername, registerConfirmUsername, registerPassword, registerConfirmPassword } = req.body;
    
    // Check user is not already registered
    const userAlreadyRegistered = await User.findOne({ username : registerUsername });
    if (userAlreadyRegistered) {
        req.flash('error', 'Username already registered, please try another');
        res.redirect('/register'); 
    } else {
        // Check that usernames and passwords match
        if (registerUsername === registerConfirmUsername) {
            if (registerPassword === registerConfirmPassword) {
                // Hash password
                var hashedPassword = await bcrypt.hash(registerPassword, 10);
                
                // Create new user
                var newUser = await new User({
                    username: registerUsername,
                    password: hashedPassword
                });

                // Create user vocabulary data
                createVocabData(registerUsername);    
                
                // Save user to database
                await newUser.save();
                req.flash('success', 'User successfully registered!');
                res.redirect('/login');
            } else {
                req.flash('error', 'Passwords do not match, please try again');
                res.redirect('/register');
            };
        } else if (registerPassword === registerConfirmPassword) {
            req.flash('error', 'Usernames do not match, please try again');
            res.redirect('/register');
        } else {
            req.flash('error', 'Usernames and passwords do not match, please try again');
            res.redirect('/register');
        };
    };
});

// LEARN PAGE
app.get('/learn', async (req, res) => {
    if (req.session.loggedIn) {
        var user = req.session.username;
        var userData = await Vocab.find({user : req.session.username});
        res.render('learn', { user, userData, loggedIn : req.session.loggedIn, successMessage : req.flash('success'), errorMessage : req.flash('error') });
    } else {
        req.flash('error', 'Please login to access this page');
        res.redirect('/login');
    };    
});

// CREATE VOCABULARY PAGE
app.get('/create', async (req, res) => {
    if(req.session.username == 'Admin') {
        res.render('create', { user : req.session.username, loggedIn : req.session.loggedIn, successMessage : req.flash('success'), errorMessage : req.flash('error') });
    } else {
        req.flash('error', 'Please login as admin to access this page');
        res.redirect('/login');
    };
});

app.post('/create', async (req, res) => {
    // Get data from form
    var { kanji, romaji, english, answerOne, answerTwo, answerThree, answerFour } = req.body;

    // Change answer data into an array
    var answers = [answerOne, answerTwo, answerThree, answerFour];

    // Check item doesn't already exist in database
    const itemAlreadyExists = await Vocab.findOne({ kanji : kanji });

    // Make all users into an array
    var allUsers = await User.find({});

    if (itemAlreadyExists) {
        req.flash('error', 'Sorry, this item already exists, please try another');
    } else {
        for (i = 0; i < allUsers.length; i++) {
            // Create new vocabulary item using data
            var newVocab = await new Vocab({
                user: allUsers[i].username,
                romaji: romaji,
                kanji: kanji,
                english: english,
                answers : answers
            });


            // Save item
            await newVocab.save();
        }

        req.flash('success', 'Item successfully saved');
    };

    // Refresh page
    res.redirect('/create');
});

// EDIT VOCABULARY PAGE
app.get('/edit', async (req, res) => {
    // Get vocab data
    var vocabData = await Vocab.find({user : "Admin"});

    // Check for admin status
    if (req.session.username == 'Admin') {
        res.render('edit', { user : req.session.username, loggedIn : req.session.loggedIn, successMessage : req.flash('success'), errorMessage : req.flash('error'), vocabData })
    } else {
        req.flash('error', 'Please login as admin to access this page');
        res.redirect('/login');
    }
});

app.post('/delete/:id', async (req, res) => {
    // Get item id from the request
    const { id } = req.params;
    
    // Delete items
    await Vocab.deleteMany({ kanji : id });

    req.flash('success', 'Item : "' + id + '" successfully deleted');
    res.redirect('/edit');
});

// EDIT INDIVIDUAL ITEM PAGE
app.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const kanji = id;

    var vocabItem = await Vocab.findOne({ kanji : kanji });

    // Check for admin status
    if (req.session.username === 'Admin') {
        res.render('item', { vocabItem, user : req.session.username, loggedIn : req.session.loggedIn, successMessage : req.flash('success'), errorMessage : req.flash('error') })
    } else {
        req.flash('error', 'Please login as admin to access this page');
        res.redirect('/login');
    }
});

// Update edited item
app.post('/item', async (req, res) => {
    // Get updated data from form
    var { kanji, english, romaji, answerOne, answerTwo, answerThree, answerFour } = req.body;

    // Find associated item in database and update

    await Vocab.updateMany(
        { 
            kanji: kanji
        },
        {
            romaji: romaji
        },
        {
            english: english,
            answers: [
                answerOne,
                answerTwo,
                answerThree,
                answerFour
            ]
        }
    );

    req.flash('success', 'Item : "' + kanji + '" successfully updated');

    res.redirect('/edit');
});

// LOGOUT
app.get('/logout', async (req, res) => {
    // Restart session
    await req.session.destroy();

    res.redirect('/login');
    questions = [];
});

// ALLOWS CLIENT TO FETCH DATA FROM DATABASE
app.get('/getDatabaseData', (req, res) => {
    res.send(questions);
});

// ALLOWS CLIENT TO UPDATE SCORES FOR EACH VOCABULARY ITEM
app.post('/sendDatabaseData', async (req, res) => {
    const updatedQuestionData = req.body;
    for (i = 0; i < updatedQuestionData.length; i++) {
        await Vocab.findOneAndUpdate(
            { 
                user: updatedQuestionData[i].user,
                english: updatedQuestionData[i].english
            },
            {
                level: updatedQuestionData[i].level,
                learned: updatedQuestionData[i].learned
            }
        );
    };
});

// ERROR 404, MUST BE PLACED AFTER OTHER ROUTES
app.all('*', async (req, res) => {
    // Redirect user to login page if using an unknown address
    // Redirect user to learn page if already logged in
    if (req.session.loggedIn) {
        req.flash('error', 'Error 404, logging out');
        res.redirect('/logout');
    } else {
        req.flash('error', 'Error 404, page not found');
        res.render('login', { loggedIn : req.session.loggedIn, successMessage : req.flash('success'), errorMessage : req.flash('error') });
    };  
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('SERVER ONLINE');
});
