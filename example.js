const { 
    Ingredients,
    Recipes,
    Menus
} = require('./src/');

Recipes.list().then(data => {
    console.log(data);
});