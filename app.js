var fs = require('fs');
var BasicCard = require('./BasicCard');
var ClozeCard = require('./ClozeCard');
var inquirer = require('inquirer');

function openMenu() {
    inquirer.prompt([ //use inquirer to ask question
        {
            type: "list", //type list gives user a list of options
            message: "\nHow do you want to study?", //message shown to the user
            choices: ["Basic Card", "Cloze Card", "Create New Card", "Exit"], //options that show in list
            name: "menuOptions" //refrence name of object
        }
    ]).then(function(answer) { //Once inquirer gets answer then...
        var waitMsg;

        switch (answer.menuOptions) {

            case 'Basic Card':
                console.log("Cool...pulling up your basic cards now");
                waitMsg = setTimeout(BasicCard, 3000);
                break;

            case 'Cloze Card':
                console.log("Awesome! Let me get your cloze cards real quick...");
                waitMsg = setTimeout(ClozeCard, 3000);

            case 'Create':
                console.log("Ok lets make a new flashcard...");
                waitMsg = setTimeout(createCard, 3000);
                break;

            case 'Exit':
                console.log("Thanks for using my app! ")
                break;

            default:
                console.log("");
                console.log("Sorry I don't understand");
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
        console.log(cardType); //prints the cardType chosen to the user

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
                        setTimeout(openMenu, 1000); //reopen the main menu to user
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

                var cardObj = { // object from the text and cloze info
                    type: "ClozeCard",
                    text: cardData.text,
                    cloze: cardData.cloze
                };
                if (cardObj.text.indexOf(cardObj.cloze) !== -1) { //checking to make sure the Cloze matches some text in the statement
                    library.push(cardObj); //push the new card into the array of cards
                    fs.writeFile("cardLibrary.json", JSON.stringify(library, null, 2)); //write the updated array to the cardLibrary file
                } else { //if the cloze doesnt match display error
                    console.log("Sorry, The cloze must match some word(s) in the text of your statement.");

                }
                inquirer.prompt([ //use inquirer to ask if the user wants to keep making cards
                    {
                        type: "list",
                        message: "Awesome! Do you want to create another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }

                ]).then(function(appData) { //once the user gives answer....
                    if (appData.anotherCard === "Yes") { //If 'Yes' then..
                        createCard(); //call the create card function again (recursion)
                    } else { //Else (if the answer isnt Yes then its No)...
                        setTimeout(openMenu, 3000); //return the user to the open menu
                    }
                });
            });
        }

    });
};