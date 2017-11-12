const hf = require('./src/index.js');

hf.Recipes.list(10).then(data => {
    console.log(data);
});