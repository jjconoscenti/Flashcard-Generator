var BasicCard = require('./BasicCard');
var ClozeCard = require('./ClozeCard');
var colors = require('colors');
var inquirer = require('inquirer');
var library = require('./cardLibrary.json');
var fs = require('fs');

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
                waitMsg = setTimeout(BasicCard, 3000);
                DisplayCards();
                break;

            case 'Cloze Card':
                console.log(colors.green("Awesome! Let me get your cloze cards real quick..."));
                waitMsg = setTimeout(ClozeCard, 3000);

            case 'Create New Card':
                console.log(colors.green("Ok lets make a new flashcard..."));
                waitMsg = setTimeout(createCard, 3000);
                break;

            case 'Exit':
                console.log(colors.yellow("Thanks for using my app! "));
                break;
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
                /
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

function DisplayCards(card) {
    if (card.type === "BasicCard") {
        drawnCard = new BasicCard(card.front, card.back);
        return drawnCard.front;
    } else if (card.type === "ClozeCard") {
        drawnCard = new ClozeCard(card.text, card.cloze);
        return drawnCard.clozeRemoved();
    }
}

// function showOnlyBasicCards();
// if (card.type === "BasicCard") {
//     console.log("Here are your basic cards");
//     console.log("=====================================================");
//     console.log("CARD 1");
//     console.log("CARD 2");
// } else {
//     consle.log(colors.red("You don't have any Basic Cards at this time"));
// }

// function to show only Cloze Cards (cloze section)
// function showOnlyClozeCards() {
// if (card.type === ClozeCard) {
//     console.log("Here are your cloze cards");
//     console.log("=============================================================");
//     console.log("CLOZECARD1");
//     console.log("CLOZECARD2");
// }

// push to log.txt
function pushToLog() {

}