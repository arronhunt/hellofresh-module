# hellofresh-module
A Javascript (Node) module for interfacing with the HelloFresh API

## Installation

```
npm install --save https://github.com/arronhunt/hellofresh-module.git
```

## Importing

CommonJS
```
const { Ingredients, Recipes, Menus } = require('hellofresh-module');
```

ES6
```
import { Ingredients, Recipes, Menus } from 'hellofresh-module';
// or
import * as hf from 'hellofresh-module';
```

## Usage

**Search**
```
Recipes.search({q: 'Pizza'}).then(results => {
    console.log(results); // Returns all recipes matching "Pizza"
});
```

**Recipes**
```
Recipes.list().then(recipes => {
    console.log(recipes); // Returns all recipes
});
```

**Menus**
```
Menus.current().then(menu => {
    console.log(menu); // Returns the menu for the current week
});
```

**Ingredients**
```
Ingredients.list().then(ingredients => {
    console.log(ingredients); // Returns all ingredients
});
```
