var BasicCard = require('./BasicCard');
var ClozeCard = require('./ClozeCard');
var colors = require('colors');
var inquirer = require('inquirer');
var library = require('./cardLibrary.json');
var fs = require('fs');

count = 0;

function openMenu() {
    inquirer.prompt([{
        type: "list",
        message: "\nHow do you want to study?",
        choices: ["Basic Card", "Cloze Card", "Create New Card", "Exit"],
        name: "menuOptions"
    }]).then(function(answer) {
        var waitMsg;

        switch (answer.menuOptions) {

            case 'Basic Card':
                console.log(colors.green("Cool...pulling up your basic cards now"));
                waitMsg = setTimeout(showBasicCards, 3000);
                break;

            case 'Cloze Card':
                console.log(colors.green("Awesome! Let me get your cloze cards real quick..."));
                waitMsg = setTimeout(showClozeCards, 3000);

            case 'Create New Card':
                console.log(colors.green("Ok lets make a new flashcard..."));
                waitMsg = setTimeout(createCard, 3000);
                break;

            case 'Exit':
                console.log(colors.yellow("Thanks for using my app! "));
                break;
            default:

                console.log(colors.red("Sorry, please try again!"));

        }

    });
}

openMenu();

function createCard() {
    inquirer.prompt([{
            type: "list",
            message: "What type of flashcard do you want to create?",
            choices: ["Basic Card", "Cloze Card"],
            name: "cardType"
        }

    ]).then(function(appData) {

        var cardType = appData.cardType;
        console.log(cardType);

        if (cardType === "Basic Card") {
            inquirer.prompt([{
                    type: "input",
                    message: "Please fill out the front of your card (Your Question).",
                    name: "front"
                },
                {
                    type: "input",
                    message: "Please fill out the back of your card (Your Answer).",
                    name: "back"
                }

            ]).then(function(cardData) {

                var cardObj = {
                    type: "BasicCard",
                    front: cardData.front,
                    back: cardData.back
                };
                library.push(cardObj);

                fs.writeFile("cardLibrary.json", JSON.stringify(library, null, 2));

                inquirer.prompt([{
                        type: "list",
                        message: "Do you want to create another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }

                ]).then(function(appData) {
                    if (appData.anotherCard === "Yes") {
                        createCard();
                    } else {
                        setTimeout(openMenu, 3000);
                    }
                });
            });

        } else { // cloze option
            inquirer.prompt([{
                    type: "input",
                    message: "Please type out the full text of your statement (remove cloze in next step).",
                    name: "text"
                },

                {
                    type: "input",
                    message: "Please type the portion of text you want to cloze, replacing it with '...'.",
                    name: "cloze"
                }

            ]).then(function(cardData) {

                var cardObj = {
                    type: "ClozeCard",
                    text: cardData.text,
                    cloze: cardData.cloze
                };
                if (cardObj.text.indexOf(cardObj.cloze) !== -1) {
                    library.push(cardObj);
                    fs.writeFile("cardLibrary.json", JSON.stringify(library, null, 2));
                } else {
                    console.log("Sorry, The cloze must match some word(s) in the text of your statement.");

                }
                inquirer.prompt([{
                        type: "list",
                        message: "Awesome! Do you want to create another card?",
                        choices: ["Yep", "Nope"],
                        name: "anotherCard"
                    }

                ]).then(function(appData) {
                    if (appData.anotherCard === "Yep") {
                        createCard();
                    } else {
                        setTimeout(openMenu, 3000);
                    }
                });
            });
        }

    });
};

function showClozeCards() {
    var library = require('./cardLibrary.json');
    for (var i = 0; i < library.length; i++) {
        if (library[i].text !== undefined) {
            console.log(colors.magenta('==============================================================='));
            console.log(colors.magenta('========================= CLOZE CARDS ========================='));
            console.log(colors.magenta('==============================================================='));
            console.log(colors.magenta('Text: ' + library[i].text));
            console.log(colors.magenta('==============================================================='));
            console.log(colors.magenta('Text: ' + library[i].cloze));
            count++;
        }
    }
}

function showBasicCards() {
    var library = require('./cardLibrary.json');
    for (var i = 0; i < library.length; i++) {
        if (library[i].front !== undefined) {
            console.log(colors.cyan('==============================================================='));
            console.log(colors.cyan('========================= BASIC CARDS ========================='));
            console.log(colors.cyan('==============================================================='));
            console.log(colors.cyan('Text: ' + library[i].front));
            console.log(colors.cyan('==============================================================='));
            console.log(colors.cyan('Text: ' + library[i].back));
            count++;
        }
    }
}



// function showAllCards() {
//     var library = require('./cardLibrary.json');

//     if (count < library.length) {
//         if (library[count].front !== undefined) {
//             console.log(colors.blue('==============================================================='));
//             console.log(colors.blue('========================= BASIC CARDS ========================='));
//             console.log(colors.blue('==============================================================='));
//             console.log('Front: ' + library[count].front);
//             console.log(colors.blue('==============================================================='));
//             console.log('Front: ' + library[count].back);
//             console.log(colors.blue('==============================================================='));
//             console.log(colors.blue('==============================================================='));
//         } else {
//             console.log(colors.magenta('==============================================================='));
//             console.log(colors.magenta('========================= CLOZE CARDS ========================='));
//             console.log(colors.magenta('==============================================================='));
//             console.log(colors.magenta('Text: ' + library[count].text));
//             console.log(colors.magenta('==============================================================='));
//             console.log(colors.magenta('Text: ' + library[count].cloze));
//         }
//         count++;
//         showAllCards();
//     } else {
//         count = 0;
//         openMenu();
//     }
// }