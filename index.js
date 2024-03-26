const Mustache = require('mustache');
const fs = require('fs');
const README_TEMPLATE = './readmeTemplate.mustache';

var msg = "Testing 1.. 2.. 3..";
console.log(msg);

const generateReadMe = async () => {
    // Generate random number for README template
    const randomNumber = Math.floor(Math.random() * 100);
    console.log('Random number is ' + randomNumber);
    const readMeData = {
        number: randomNumber
    };
    
    fs.readFile(README_TEMPLATE, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), readMeData);
        fs.writeFileSync('README.md', output);
    });
}

generateReadMe();
