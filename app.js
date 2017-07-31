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
                waitMsg = setTimeout(BasicCard, 2000);
                break;

            case 'Cloze Card':
                console.log(colors.green("Awesome! Let me get your cloze cards real quick..."));
                waitMsg = setTimeout(ClozeCard, 2000);

            case 'Create New Card':
                console.log(colors.green("Ok lets make a new flashcard..."));
                waitMsg = setTimeout(createCard, 2000);
                break;

            case 'Exit':
                console.log(colors.yellow("Thanks for using my app! "));
                break;

            default:
                console.log("");
                console.log(colors.red("Sorry I don't understand"));
                console.log("");
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

        var cardType = appData.cardType; // "cardType" will store the choice from the cardType inquirer object
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

                var cardObj = { //builds an object with front and back info
                    type: "BasicCard",
                    front: cardData.front,
                    back: cardData.back
                };
                library.push(cardObj); //push the new card into the array of cards
                fs.writeFile("cardLibrary.json", JSON.stringify(library, null, 2)); //write the updated array to the carLibrary.json file

                inquirer.prompt([ //use inquirer to ask if the user wants to keep making cards
                    {
                        type: "list",
                        message: "Do you want to create another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }

                ]).then(function(appData) {
                    if (appData.anotherCard === "Yes") {
                        createCard(); // call the create card function again (recursion)
                    } else {
                        setTimeout(openMenu, 2000); //reopen the main menu to user
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
                    library.push(cardObj); //push the new card into the array of cards
                    fs.writeFile("cardLibrary.json", JSON.stringify(library, null, 2));
                } else { //if the cloze doesnt match display error
                    console.log("Sorry, The cloze must match some word(s) in the text of your statement.");

                }
                inquirer.prompt([{
                        type: "list",
                        message: "Awesome! Do you want to create another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }

                ]).then(function(appData) {
                    if (appData.anotherCard === "Yes") {
                        createCard();
                    } else {
                        setTimeout(openMenu, 2000);
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