// IMPORT FUNCTIONS FROM SCRIPT FILE
const checkForDuplicate = require('../learn');

// TEST FUNCTIONS
test('Checks array to see if item is already present in an array', () => {
    const array = [
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
        }
    ];

    const item = {
        kanji: '人',
        english: 'Person',
        answers: [
            'Person',
            'Man',
            'Woman',
            'Child'
        ]
    };

    expect(checkForDuplicate(array, item).toBe(true));
});