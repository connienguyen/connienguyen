const Mustache = require('mustache');
const fs = require('fs');
const FOOD_EMOJI = require('./food-emoji.json');
const README_TEMPLATE = './readmeTemplate.mustache';

const getWeather = async () => {
    const temp = 32;
    if (temp > 85) {
        console.log(FOOD_EMOJI.hot)
    } else if (temp < 70) {
        console.log(FOOD_EMOJI.cold)
    } else {
        console.log(FOOD_EMOJI.any)
    }
}

const getFood = (temp) => {
    var foods = [];
    if (temp > 85) {
        foods = FOOD_EMOJI.hot;
    } else if (temp < 70) {
        foods = FOOD_EMOJI.cold;
    } else {
        foods = FOOD_EMOJI.any;
    }
    return foods[Math.floor(Math.random() * foods.length)];
}

const generateReadMe = async () => {
    // Generate random number for README template
    const randomNumber = Math.floor(Math.random() * 100);
    console.log('Random number is ' + randomNumber);
    getWeather();
    const readMeData = {
        number: getFood(randomNumber)
    };
    
    fs.readFile(README_TEMPLATE, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), readMeData);
        fs.writeFileSync('README.md', output);
    });
}

generateReadMe();
