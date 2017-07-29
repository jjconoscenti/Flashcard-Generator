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
    }])
}