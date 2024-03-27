const Mustache = require('mustache')
const fs = require('fs')
const FOOD_EMOJI = require('./food-emoji.json')
const README_TEMPLATE = './readmeTemplate.mustache'

/**
 * Generate a random integer between min and max
 * @param {Int} min
 * @param {Int} max
 * @returns Int random integer
 */
const getRandomInt = (min, max) => {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max + 1)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

/**
 * Retrieves current or upcoming daytime weather forecast for LA area from weather.gov
 * @returns forecast Object or null
 */
const getWeather = async () => {
  const result = await fetch(
    `https://api.weather.gov/gridpoints/LOX/157,48/forecast`
  )
  .then(response => response.json())

  const forecasts = result.properties.periods
  if (Array.isArray(forecasts)) {
    // Cycle through forecasts until there is a daytime forecast
    for (const forecast of forecasts) {
      if (forecast.isDaytime) { return forecast }
    }
  }
  
  // Else return null if no daytime forecase is available
  console.log('Could not retrieve daytime forecast')
  return
}

/**
 * Randomly selects a food item based on temperature
 * @param {Int} temp
 * @returns String for food emoji name
 */
const getFood = (temp) => {
  let foods = []
  if (temp > 90) {
    foods = FOOD_EMOJI.hot
  } else if (temp < 65) {
    foods = FOOD_EMOJI.cold
  } else {
    foods = FOOD_EMOJI.any
  }
  console.log('Preparing food for the octocat')
  return foods[Math.floor(Math.random() * foods.length)]
}

/**
 * Generates data for README file and writes to file
 */
const generateReadMe = async () => {
  // Set default values in case no forecast is retrieved
  let foodIndex = getRandomInt(40, 100)
  let weatherString = 'Today\'s weather is a mystery :crystal_ball:'
  const forecast = await getWeather()

  if (forecast) {
    foodIndex = forecast.temperature;
    let extraIcon = ''
    if (forecast.shortForecast === 'Sunny') {
        extraIcon = ' &#9728;'
    } else if (forecast.shortForecast == 'Rain') {
        extraIcon = ' &#9730;'
    }
    weatherString = 'It\'s ' + forecast.temperature + '\&#8457;' + extraIcon + ' in Los Angeles today'
  }

  const readMeData = {
    weather: weatherString,
    food: getFood(foodIndex)
  }

  fs.readFile(README_TEMPLATE, (err, data) => {
    if (err) { throw err }
    const output = Mustache.render(data.toString(), readMeData)
    fs.writeFileSync('README.md', output)
  })
}

generateReadMe()