const Mustache = require('mustache');
const fs = require('fs');
const FOOD_EMOJI = require('./food-emoji.json');
const README_TEMPLATE = './readmeTemplate.mustache';

// Retrieve weather information for Los Angeles
const getWeather = async () => {
    const result = await fetch(
        `https://api.weather.gov/gridpoints/LOX/157,48/forecast`
    )
    .then(response => response.json());

    const forecasts = result.properties.periods;
    if (Array.isArray(forecasts)) {
        // Cycle through forecasts until there is a daytime forecast
        for (const forecast of forecasts) {
            if (forecast.isDaytime) { return forecast; }
            else { break; }
        }
    } else { return; }
}

// Based on temperature, randomly select an emoji food item
const getFood = (temp) => {
    let foods = [];
    if (temp > 90) {
        foods = FOOD_EMOJI.hot;
    } else if (temp < 65) {
        foods = FOOD_EMOJI.cold;
    } else {
        foods = FOOD_EMOJI.any;
    }
    console.log("Preparing food for the octocat");
    return foods[Math.floor(Math.random() * foods.length)];
}

const generateReadMe = async () => {
    // Generate random number for README template if no temperature
    let foodIndex = Math.floor(Math.random() * 100);
    let weatherString = "Today's weather is a mystery :crystal_ball:";
    const forecast = await getWeather();
    if (forecast) {
        foodIndex = forecast.temperature;
        let extraIcon = "";
        if (forecast.shortForecast == "Sunny") {
            extraIcon = " &#9728;";
        } else if (forecast.shortForecast == "Rain") {
            extraIcon = " &#9730;"
        }
        weatherString = "It's " + forecast.temperature + "\&#8457;" + extraIcon + " in Los Angeles today";
    }
    const readMeData = {
        weather: weatherString,
        food: getFood(foodIndex)
    };
    
    fs.readFile(README_TEMPLATE, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), readMeData);
        fs.writeFileSync('README.md', output);
    });
}

generateReadMe();
