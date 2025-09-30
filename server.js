const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'flavorgraph-secret-key-2024';

// Security middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Initialize SQLite database
const db = new sqlite3.Database('./flavorgraph.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Recipes table
  db.run(`CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT,
    difficulty TEXT DEFAULT 'medium',
    time INTEGER DEFAULT 30,
    cuisine TEXT DEFAULT 'international',
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Ingredients table
  db.run(`CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Recipe ingredients relationship
  db.run(`CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id INTEGER,
    ingredient_id INTEGER,
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes (id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients (id)
  )`);

  // Insert sample data
  insertSampleData();
}

// Insert sample recipes and ingredients
function insertSampleData() {
  const sampleRecipes = [
    // Italian Cuisine
    {
      name: "Classic Spaghetti Carbonara",
      ingredients: ["pasta", "eggs", "bacon", "parmesan", "black pepper"],
      instructions: "Cook pasta, mix eggs with cheese, combine with hot pasta and bacon",
      difficulty: "medium",
      time: 30,
      cuisine: "italian"
    },
    {
      name: "Margherita Pizza",
      ingredients: ["pizza dough", "tomato sauce", "mozzarella", "basil", "olive oil"],
      instructions: "Roll dough, add sauce and cheese, bake until golden",
      difficulty: "medium",
      time: 40,
      cuisine: "italian"
    },
    {
      name: "Pasta Primavera",
      ingredients: ["pasta", "broccoli", "carrot", "bell pepper", "garlic", "olive oil"],
      instructions: "Cook pasta, sauté vegetables, combine with pasta",
      difficulty: "easy",
      time: 25,
      cuisine: "italian"
    },
    {
      name: "Chicken Parmesan",
      ingredients: ["chicken breast", "breadcrumbs", "eggs", "tomato sauce", "mozzarella", "parmesan"],
      instructions: "Bread chicken, fry until golden, top with sauce and cheese, bake",
      difficulty: "medium",
      time: 45,
      cuisine: "italian"
    },
    {
      name: "Risotto Milanese",
      ingredients: ["arborio rice", "chicken broth", "onion", "saffron", "parmesan", "butter"],
      instructions: "Sauté rice with onion, add broth gradually, finish with saffron and cheese",
      difficulty: "hard",
      time: 50,
      cuisine: "italian"
    },
    {
      name: "Lasagna",
      ingredients: ["lasagna noodles", "ground beef", "ricotta", "mozzarella", "tomato sauce", "onion"],
      instructions: "Layer noodles, meat sauce, and cheeses, bake until bubbly",
      difficulty: "medium",
      time: 60,
      cuisine: "italian"
    },

    // Asian Cuisine
    {
      name: "Chicken Stir Fry",
      ingredients: ["chicken", "bell pepper", "onion", "garlic", "soy sauce", "oil"],
      instructions: "Cut chicken and vegetables, stir fry in hot oil with soy sauce",
      difficulty: "easy",
      time: 20,
      cuisine: "asian"
    },
    {
      name: "Beef and Broccoli",
      ingredients: ["beef", "broccoli", "garlic", "ginger", "soy sauce", "oyster sauce"],
      instructions: "Marinate beef, stir fry with broccoli and sauce",
      difficulty: "easy",
      time: 25,
      cuisine: "asian"
    },
    {
      name: "Chicken Fried Rice",
      ingredients: ["rice", "chicken", "eggs", "peas", "carrot", "soy sauce", "oil"],
      instructions: "Cook rice, scramble eggs, stir fry with chicken and vegetables",
      difficulty: "easy",
      time: 30,
      cuisine: "asian"
    },
    {
      name: "Sweet and Sour Pork",
      ingredients: ["pork", "bell pepper", "pineapple", "vinegar", "sugar", "soy sauce"],
      instructions: "Fry pork, add vegetables and sweet-sour sauce",
      difficulty: "medium",
      time: 35,
      cuisine: "asian"
    },
    {
      name: "Pad Thai",
      ingredients: ["rice noodles", "shrimp", "eggs", "bean sprouts", "peanuts", "fish sauce"],
      instructions: "Soak noodles, stir fry with shrimp, eggs, and sauce",
      difficulty: "medium",
      time: 30,
      cuisine: "asian"
    },
    {
      name: "Teriyaki Chicken",
      ingredients: ["chicken", "teriyaki sauce", "garlic", "ginger", "sesame oil"],
      instructions: "Marinate chicken, grill or pan-fry with teriyaki sauce",
      difficulty: "easy",
      time: 25,
      cuisine: "asian"
    },
    {
      name: "Miso Soup",
      ingredients: ["miso paste", "tofu", "seaweed", "green onions", "dashi"],
      instructions: "Heat dashi, dissolve miso, add tofu and seaweed",
      difficulty: "easy",
      time: 15,
      cuisine: "asian"
    },

    // Mexican Cuisine
    {
      name: "Beef Tacos",
      ingredients: ["ground beef", "tortillas", "lettuce", "tomato", "cheese", "onion"],
      instructions: "Cook ground beef with spices, serve in tortillas with toppings",
      difficulty: "easy",
      time: 25,
      cuisine: "mexican"
    },
    {
      name: "Chicken Quesadillas",
      ingredients: ["chicken", "tortillas", "cheese", "bell pepper", "onion", "oil"],
      instructions: "Cook chicken and vegetables, assemble in tortillas, grill",
      difficulty: "easy",
      time: 20,
      cuisine: "mexican"
    },
    {
      name: "Beef Burritos",
      ingredients: ["ground beef", "tortillas", "rice", "beans", "cheese", "sour cream"],
      instructions: "Cook beef with spices, wrap in tortillas with rice and beans",
      difficulty: "easy",
      time: 30,
      cuisine: "mexican"
    },
    {
      name: "Chicken Enchiladas",
      ingredients: ["chicken", "tortillas", "enchilada sauce", "cheese", "onion"],
      instructions: "Shred chicken, roll in tortillas, top with sauce and cheese, bake",
      difficulty: "medium",
      time: 45,
      cuisine: "mexican"
    },
    {
      name: "Guacamole",
      ingredients: ["avocado", "lime", "tomato", "onion", "cilantro", "salt"],
      instructions: "Mash avocado, mix with lime juice and chopped vegetables",
      difficulty: "easy",
      time: 10,
      cuisine: "mexican"
    },

    // Indian Cuisine
    {
      name: "Vegetable Curry",
      ingredients: ["potato", "carrot", "onion", "coconut milk", "curry powder", "garlic"],
      instructions: "Sauté vegetables, add curry powder and coconut milk, simmer",
      difficulty: "medium",
      time: 35,
      cuisine: "indian"
    },
    {
      name: "Chicken Tikka Masala",
      ingredients: ["chicken", "yogurt", "tomato sauce", "garlic", "ginger", "garam masala"],
      instructions: "Marinate chicken, grill, simmer in tomato-based sauce",
      difficulty: "medium",
      time: 50,
      cuisine: "indian"
    },
    {
      name: "Dal Tadka",
      ingredients: ["lentils", "onion", "garlic", "cumin", "turmeric", "oil"],
      instructions: "Cook lentils, temper with spices and onions",
      difficulty: "easy",
      time: 30,
      cuisine: "indian"
    },
    {
      name: "Biryani",
      ingredients: ["rice", "chicken", "onion", "garlic", "ginger", "saffron", "yogurt"],
      instructions: "Marinate chicken, layer with rice, cook on low heat",
      difficulty: "hard",
      time: 60,
      cuisine: "indian"
    },
    {
      name: "Naan Bread",
      ingredients: ["flour", "yogurt", "yeast", "garlic", "butter", "salt"],
      instructions: "Make dough, roll flat, cook on hot griddle",
      difficulty: "medium",
      time: 40,
      cuisine: "indian"
    },

    // American Cuisine
    {
      name: "Caesar Salad",
      ingredients: ["lettuce", "croutons", "parmesan", "lemon", "garlic", "olive oil"],
      instructions: "Mix lettuce with dressing, add croutons and parmesan",
      difficulty: "easy",
      time: 15,
      cuisine: "american"
    },
    {
      name: "Beef Burger",
      ingredients: ["ground beef", "burger bun", "lettuce", "tomato", "onion", "cheese"],
      instructions: "Form patties, grill beef, assemble burger with toppings",
      difficulty: "easy",
      time: 20,
      cuisine: "american"
    },
    {
      name: "Chicken Noodle Soup",
      ingredients: ["chicken", "noodles", "carrot", "celery", "onion", "garlic"],
      instructions: "Simmer chicken, add vegetables and noodles",
      difficulty: "easy",
      time: 30,
      cuisine: "american"
    },
    {
      name: "Mac and Cheese",
      ingredients: ["pasta", "cheese", "milk", "butter", "flour", "breadcrumbs"],
      instructions: "Make cheese sauce, mix with pasta, top with breadcrumbs, bake",
      difficulty: "easy",
      time: 35,
      cuisine: "american"
    },
    {
      name: "BBQ Ribs",
      ingredients: ["pork ribs", "bbq sauce", "garlic", "onion", "brown sugar"],
      instructions: "Season ribs, slow cook, glaze with BBQ sauce",
      difficulty: "medium",
      time: 120,
      cuisine: "american"
    },
    {
      name: "Buffalo Wings",
      ingredients: ["chicken wings", "hot sauce", "butter", "garlic", "celery"],
      instructions: "Fry wings, toss in hot sauce mixture, serve with celery",
      difficulty: "easy",
      time: 25,
      cuisine: "american"
    },

    // Mediterranean Cuisine
    {
      name: "Greek Salad",
      ingredients: ["tomato", "cucumber", "olives", "feta cheese", "olive oil", "oregano"],
      instructions: "Chop vegetables, mix with feta and dressing",
      difficulty: "easy",
      time: 15,
      cuisine: "mediterranean"
    },
    {
      name: "Hummus",
      ingredients: ["chickpeas", "tahini", "lemon", "garlic", "olive oil", "cumin"],
      instructions: "Blend chickpeas with tahini, lemon, and spices",
      difficulty: "easy",
      time: 15,
      cuisine: "mediterranean"
    },
    {
      name: "Falafel",
      ingredients: ["chickpeas", "onion", "garlic", "parsley", "cumin", "flour"],
      instructions: "Blend ingredients, form balls, deep fry",
      difficulty: "medium",
      time: 40,
      cuisine: "mediterranean"
    },
    {
      name: "Tabbouleh",
      ingredients: ["bulgur", "tomato", "parsley", "mint", "lemon", "olive oil"],
      instructions: "Soak bulgur, mix with chopped herbs and vegetables",
      difficulty: "easy",
      time: 20,
      cuisine: "mediterranean"
    },

    // French Cuisine
    {
      name: "Coq au Vin",
      ingredients: ["chicken", "wine", "bacon", "mushrooms", "onion", "garlic"],
      instructions: "Brown chicken, simmer in wine with vegetables",
      difficulty: "hard",
      time: 90,
      cuisine: "french"
    },
    {
      name: "Ratatouille",
      ingredients: ["eggplant", "zucchini", "tomato", "bell pepper", "onion", "herbs"],
      instructions: "Sauté vegetables separately, combine and simmer",
      difficulty: "medium",
      time: 45,
      cuisine: "french"
    },
    {
      name: "French Onion Soup",
      ingredients: ["onions", "beef broth", "cheese", "bread", "butter", "thyme"],
      instructions: "Caramelize onions, add broth, top with bread and cheese, broil",
      difficulty: "medium",
      time: 60,
      cuisine: "french"
    },

    // Thai Cuisine
    {
      name: "Green Curry",
      ingredients: ["chicken", "green curry paste", "coconut milk", "eggplant", "basil", "fish sauce"],
      instructions: "Cook curry paste, add coconut milk and chicken, simmer",
      difficulty: "medium",
      time: 30,
      cuisine: "thai"
    },
    {
      name: "Tom Yum Soup",
      ingredients: ["shrimp", "lemongrass", "lime", "chili", "mushrooms", "fish sauce"],
      instructions: "Simmer broth with aromatics, add shrimp and vegetables",
      difficulty: "medium",
      time: 25,
      cuisine: "thai"
    },
    {
      name: "Pad See Ew",
      ingredients: ["rice noodles", "beef", "broccoli", "soy sauce", "garlic", "eggs"],
      instructions: "Stir fry noodles with beef and vegetables in soy sauce",
      difficulty: "medium",
      time: 25,
      cuisine: "thai"
    },

    // Chinese Cuisine
    {
      name: "Kung Pao Chicken",
      ingredients: ["chicken", "peanuts", "bell pepper", "chili", "soy sauce", "vinegar"],
      instructions: "Stir fry chicken with vegetables and peanuts in spicy sauce",
      difficulty: "medium",
      time: 25,
      cuisine: "chinese"
    },
    {
      name: "Sweet and Sour Chicken",
      ingredients: ["chicken", "bell pepper", "pineapple", "vinegar", "sugar", "ketchup"],
      instructions: "Fry chicken, add vegetables and sweet-sour sauce",
      difficulty: "medium",
      time: 30,
      cuisine: "chinese"
    },
    {
      name: "Chow Mein",
      ingredients: ["noodles", "chicken", "cabbage", "carrot", "soy sauce", "garlic"],
      instructions: "Stir fry noodles with chicken and vegetables",
      difficulty: "easy",
      time: 20,
      cuisine: "chinese"
    },

    // Japanese Cuisine
    {
      name: "Chicken Teriyaki",
      ingredients: ["chicken", "teriyaki sauce", "garlic", "ginger", "sesame seeds"],
      instructions: "Marinate chicken, grill with teriyaki sauce",
      difficulty: "easy",
      time: 25,
      cuisine: "japanese"
    },
    {
      name: "Tempura",
      ingredients: ["shrimp", "flour", "eggs", "oil", "dipping sauce", "vegetables"],
      instructions: "Make batter, coat shrimp and vegetables, deep fry",
      difficulty: "medium",
      time: 30,
      cuisine: "japanese"
    },
    {
      name: "Ramen",
      ingredients: ["ramen noodles", "pork", "eggs", "green onions", "miso", "seaweed"],
      instructions: "Make broth, cook noodles, top with pork and eggs",
      difficulty: "medium",
      time: 40,
      cuisine: "japanese"
    },

    // Korean Cuisine
    {
      name: "Bulgogi",
      ingredients: ["beef", "soy sauce", "garlic", "ginger", "sesame oil", "pear"],
      instructions: "Marinate beef, grill or pan-fry",
      difficulty: "easy",
      time: 30,
      cuisine: "korean"
    },
    {
      name: "Kimchi Fried Rice",
      ingredients: ["rice", "kimchi", "eggs", "green onions", "soy sauce", "oil"],
      instructions: "Stir fry rice with kimchi, top with fried egg",
      difficulty: "easy",
      time: 20,
      cuisine: "korean"
    },
    {
      name: "Bibimbap",
      ingredients: ["rice", "beef", "vegetables", "eggs", "gochujang", "sesame oil"],
      instructions: "Arrange rice with vegetables and beef, top with egg",
      difficulty: "medium",
      time: 35,
      cuisine: "korean"
    },

    // British Cuisine
    {
      name: "Fish and Chips",
      ingredients: ["fish", "potato", "flour", "oil", "lemon", "salt"],
      instructions: "Batter fish, deep fry with chips",
      difficulty: "medium",
      time: 45,
      cuisine: "british"
    },
    {
      name: "Shepherd's Pie",
      ingredients: ["ground lamb", "potato", "onion", "carrot", "peas", "gravy"],
      instructions: "Cook meat with vegetables, top with mashed potatoes, bake",
      difficulty: "medium",
      time: 60,
      cuisine: "british"
    },
    {
      name: "Bangers and Mash",
      ingredients: ["sausages", "potato", "onion", "gravy", "butter", "milk"],
      instructions: "Cook sausages, make mashed potatoes, serve with onion gravy",
      difficulty: "easy",
      time: 30,
      cuisine: "british"
    },

    // Spanish Cuisine
    {
      name: "Paella",
      ingredients: ["rice", "chicken", "shrimp", "saffron", "bell pepper", "onion"],
      instructions: "Sauté rice, add broth and seafood, cook until rice is tender",
      difficulty: "hard",
      time: 50,
      cuisine: "spanish"
    },
    {
      name: "Gazpacho",
      ingredients: ["tomato", "cucumber", "bell pepper", "onion", "garlic", "olive oil"],
      instructions: "Blend vegetables with olive oil, chill and serve",
      difficulty: "easy",
      time: 20,
      cuisine: "spanish"
    },
    {
      name: "Tortilla Española",
      ingredients: ["potato", "eggs", "onion", "olive oil", "salt"],
      instructions: "Cook potatoes and onions, mix with eggs, cook in pan",
      difficulty: "medium",
      time: 40,
      cuisine: "spanish"
    },

    // German Cuisine
    {
      name: "Schnitzel",
      ingredients: ["pork", "breadcrumbs", "eggs", "flour", "oil", "lemon"],
      instructions: "Bread pork cutlets, pan-fry until golden",
      difficulty: "medium",
      time: 30,
      cuisine: "german"
    },
    {
      name: "Sauerkraut",
      ingredients: ["cabbage", "salt", "caraway seeds", "apple", "onion"],
      instructions: "Ferment cabbage with salt and spices",
      difficulty: "easy",
      time: 480,
      cuisine: "german"
    },

    // Brazilian Cuisine
    {
      name: "Feijoada",
      ingredients: ["black beans", "pork", "sausage", "onion", "garlic", "bay leaves"],
      instructions: "Slow cook beans with meat and spices",
      difficulty: "medium",
      time: 180,
      cuisine: "brazilian"
    },
    {
      name: "Pão de Açúcar",
      ingredients: ["flour", "eggs", "sugar", "butter", "yeast", "milk"],
      instructions: "Make sweet bread dough, shape and bake",
      difficulty: "medium",
      time: 90,
      cuisine: "brazilian"
    },

    // Vegetarian/Vegan Options
    {
      name: "Vegetarian Chili",
      ingredients: ["beans", "tomato", "onion", "bell pepper", "chili powder", "garlic"],
      instructions: "Sauté vegetables, add beans and spices, simmer",
      difficulty: "easy",
      time: 40,
      cuisine: "vegetarian"
    },
    {
      name: "Quinoa Salad",
      ingredients: ["quinoa", "cucumber", "tomato", "onion", "lemon", "olive oil"],
      instructions: "Cook quinoa, mix with vegetables and dressing",
      difficulty: "easy",
      time: 25,
      cuisine: "vegetarian"
    },
    {
      name: "Veggie Burger",
      ingredients: ["black beans", "oats", "onion", "garlic", "spices", "egg"],
      instructions: "Mash beans, mix with oats and spices, form patties, cook",
      difficulty: "medium",
      time: 35,
      cuisine: "vegetarian"
    },
    {
      name: "Stuffed Bell Peppers",
      ingredients: ["bell pepper", "rice", "tomato", "onion", "cheese", "herbs"],
      instructions: "Hollow peppers, stuff with rice mixture, bake",
      difficulty: "medium",
      time: 50,
      cuisine: "vegetarian"
    }
  ];

  // Insert sample recipes
  sampleRecipes.forEach(recipe => {
    db.run(`INSERT OR IGNORE INTO recipes (name, ingredients, instructions, difficulty, time, cuisine) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      [recipe.name, JSON.stringify(recipe.ingredients), recipe.instructions, 
       recipe.difficulty, recipe.time, recipe.cuisine]);
  });

  // Insert comprehensive ingredient database
  const allIngredients = [
    // Proteins
    { name: "chicken", category: "protein" },
    { name: "beef", category: "protein" },
    { name: "pork", category: "protein" },
    { name: "lamb", category: "protein" },
    { name: "fish", category: "protein" },
    { name: "shrimp", category: "protein" },
    { name: "salmon", category: "protein" },
    { name: "tuna", category: "protein" },
    { name: "crab", category: "protein" },
    { name: "lobster", category: "protein" },
    { name: "eggs", category: "protein" },
    { name: "tofu", category: "protein" },
    { name: "tempeh", category: "protein" },
    { name: "ground beef", category: "protein" },
    { name: "ground turkey", category: "protein" },
    { name: "ground chicken", category: "protein" },
    { name: "bacon", category: "protein" },
    { name: "ham", category: "protein" },
    { name: "sausage", category: "protein" },
    { name: "chorizo", category: "protein" },

    // Vegetables
    { name: "onion", category: "vegetable" },
    { name: "garlic", category: "vegetable" },
    { name: "tomato", category: "vegetable" },
    { name: "potato", category: "vegetable" },
    { name: "carrot", category: "vegetable" },
    { name: "celery", category: "vegetable" },
    { name: "bell pepper", category: "vegetable" },
    { name: "broccoli", category: "vegetable" },
    { name: "cauliflower", category: "vegetable" },
    { name: "cabbage", category: "vegetable" },
    { name: "lettuce", category: "vegetable" },
    { name: "spinach", category: "vegetable" },
    { name: "kale", category: "vegetable" },
    { name: "cucumber", category: "vegetable" },
    { name: "zucchini", category: "vegetable" },
    { name: "eggplant", category: "vegetable" },
    { name: "mushrooms", category: "vegetable" },
    { name: "green beans", category: "vegetable" },
    { name: "peas", category: "vegetable" },
    { name: "corn", category: "vegetable" },
    { name: "asparagus", category: "vegetable" },
    { name: "artichoke", category: "vegetable" },
    { name: "avocado", category: "vegetable" },
    { name: "sweet potato", category: "vegetable" },
    { name: "beet", category: "vegetable" },
    { name: "radish", category: "vegetable" },
    { name: "turnip", category: "vegetable" },
    { name: "leek", category: "vegetable" },
    { name: "scallions", category: "vegetable" },
    { name: "green onions", category: "vegetable" },

    // Grains & Starches
    { name: "rice", category: "grain" },
    { name: "pasta", category: "grain" },
    { name: "bread", category: "grain" },
    { name: "flour", category: "grain" },
    { name: "quinoa", category: "grain" },
    { name: "barley", category: "grain" },
    { name: "oats", category: "grain" },
    { name: "bulgur", category: "grain" },
    { name: "couscous", category: "grain" },
    { name: "noodles", category: "grain" },
    { name: "rice noodles", category: "grain" },
    { name: "ramen noodles", category: "grain" },
    { name: "lasagna noodles", category: "grain" },
    { name: "tortillas", category: "grain" },
    { name: "pizza dough", category: "grain" },
    { name: "burger bun", category: "grain" },
    { name: "breadcrumbs", category: "grain" },
    { name: "croutons", category: "grain" },

    // Dairy & Eggs
    { name: "milk", category: "dairy" },
    { name: "cheese", category: "dairy" },
    { name: "mozzarella", category: "dairy" },
    { name: "parmesan", category: "dairy" },
    { name: "cheddar", category: "dairy" },
    { name: "feta", category: "dairy" },
    { name: "ricotta", category: "dairy" },
    { name: "cream cheese", category: "dairy" },
    { name: "sour cream", category: "dairy" },
    { name: "yogurt", category: "dairy" },
    { name: "butter", category: "dairy" },
    { name: "heavy cream", category: "dairy" },
    { name: "buttermilk", category: "dairy" },

    // Legumes & Beans
    { name: "beans", category: "legume" },
    { name: "black beans", category: "legume" },
    { name: "kidney beans", category: "legume" },
    { name: "chickpeas", category: "legume" },
    { name: "lentils", category: "legume" },
    { name: "split peas", category: "legume" },
    { name: "lima beans", category: "legume" },
    { name: "navy beans", category: "legume" },
    { name: "pinto beans", category: "legume" },

    // Fruits
    { name: "lemon", category: "fruit" },
    { name: "lime", category: "fruit" },
    { name: "orange", category: "fruit" },
    { name: "apple", category: "fruit" },
    { name: "banana", category: "fruit" },
    { name: "pineapple", category: "fruit" },
    { name: "mango", category: "fruit" },
    { name: "pear", category: "fruit" },
    { name: "peach", category: "fruit" },
    { name: "strawberry", category: "fruit" },
    { name: "blueberry", category: "fruit" },
    { name: "raspberry", category: "fruit" },
    { name: "cranberry", category: "fruit" },
    { name: "grape", category: "fruit" },
    { name: "cherry", category: "fruit" },

    // Herbs & Spices
    { name: "basil", category: "herb" },
    { name: "oregano", category: "herb" },
    { name: "thyme", category: "herb" },
    { name: "rosemary", category: "herb" },
    { name: "parsley", category: "herb" },
    { name: "cilantro", category: "herb" },
    { name: "mint", category: "herb" },
    { name: "dill", category: "herb" },
    { name: "sage", category: "herb" },
    { name: "tarragon", category: "herb" },
    { name: "chives", category: "herb" },
    { name: "black pepper", category: "spice" },
    { name: "salt", category: "spice" },
    { name: "garlic powder", category: "spice" },
    { name: "onion powder", category: "spice" },
    { name: "paprika", category: "spice" },
    { name: "cumin", category: "spice" },
    { name: "coriander", category: "spice" },
    { name: "turmeric", category: "spice" },
    { name: "ginger", category: "spice" },
    { name: "cinnamon", category: "spice" },
    { name: "nutmeg", category: "spice" },
    { name: "cloves", category: "spice" },
    { name: "cardamom", category: "spice" },
    { name: "star anise", category: "spice" },
    { name: "bay leaves", category: "spice" },
    { name: "chili powder", category: "spice" },
    { name: "cayenne pepper", category: "spice" },
    { name: "red pepper flakes", category: "spice" },
    { name: "curry powder", category: "spice" },
    { name: "garam masala", category: "spice" },
    { name: "saffron", category: "spice" },

    // Sauces & Condiments
    { name: "soy sauce", category: "sauce" },
    { name: "oyster sauce", category: "sauce" },
    { name: "fish sauce", category: "sauce" },
    { name: "teriyaki sauce", category: "sauce" },
    { name: "tomato sauce", category: "sauce" },
    { name: "enchilada sauce", category: "sauce" },
    { name: "bbq sauce", category: "sauce" },
    { name: "hot sauce", category: "sauce" },
    { name: "sriracha", category: "sauce" },
    { name: "ketchup", category: "sauce" },
    { name: "mustard", category: "sauce" },
    { name: "mayonnaise", category: "sauce" },
    { name: "worcestershire sauce", category: "sauce" },
    { name: "vinegar", category: "sauce" },
    { name: "balsamic vinegar", category: "sauce" },
    { name: "apple cider vinegar", category: "sauce" },
    { name: "rice vinegar", category: "sauce" },

    // Oils & Fats
    { name: "oil", category: "fat" },
    { name: "olive oil", category: "fat" },
    { name: "vegetable oil", category: "fat" },
    { name: "coconut oil", category: "fat" },
    { name: "sesame oil", category: "fat" },
    { name: "avocado oil", category: "fat" },
    { name: "canola oil", category: "fat" },
    { name: "sunflower oil", category: "fat" },

    // Nuts & Seeds
    { name: "peanuts", category: "nut" },
    { name: "almonds", category: "nut" },
    { name: "walnuts", category: "nut" },
    { name: "cashews", category: "nut" },
    { name: "pecans", category: "nut" },
    { name: "pistachios", category: "nut" },
    { name: "hazelnuts", category: "nut" },
    { name: "sesame seeds", category: "seed" },
    { name: "sunflower seeds", category: "seed" },
    { name: "pumpkin seeds", category: "seed" },
    { name: "chia seeds", category: "seed" },
    { name: "flax seeds", category: "seed" },

    // Liquids
    { name: "water", category: "liquid" },
    { name: "broth", category: "liquid" },
    { name: "chicken broth", category: "liquid" },
    { name: "beef broth", category: "liquid" },
    { name: "vegetable broth", category: "liquid" },
    { name: "coconut milk", category: "liquid" },
    { name: "almond milk", category: "liquid" },
    { name: "oat milk", category: "liquid" },
    { name: "wine", category: "liquid" },
    { name: "beer", category: "liquid" },

    // Special Ingredients
    { name: "miso paste", category: "special" },
    { name: "tahini", category: "special" },
    { name: "gochujang", category: "special" },
    { name: "kimchi", category: "special" },
    { name: "seaweed", category: "special" },
    { name: "dashi", category: "special" },
    { name: "lemongrass", category: "special" },
    { name: "galangal", category: "special" },
    { name: "kaffir lime leaves", category: "special" },
    { name: "fish sauce", category: "special" },
    { name: "oyster sauce", category: "special" },
    { name: "hoisin sauce", category: "special" },
    { name: "sambal oelek", category: "special" },
    { name: "green curry paste", category: "special" },
    { name: "red curry paste", category: "special" },
    { name: "yellow curry paste", category: "special" },
    { name: "massaman curry paste", category: "special" },
    { name: "panang curry paste", category: "special" },
    { name: "tom yum paste", category: "special" },
    { name: "bean sprouts", category: "special" },
    { name: "bamboo shoots", category: "special" },
    { name: "water chestnuts", category: "special" },
    { name: "shiitake mushrooms", category: "special" },
    { name: "enoki mushrooms", category: "special" },
    { name: "oyster mushrooms", category: "special" },
    { name: "portobello mushrooms", category: "special" },
    { name: "nutritional yeast", category: "special" },
    { name: "cashew cream", category: "special" },
    { name: "coconut cream", category: "special" },
    { name: "tamarind paste", category: "special" },
    { name: "palm sugar", category: "special" },
    { name: "jaggery", category: "special" },
    { name: "ghee", category: "special" },
    { name: "clarified butter", category: "special" }
  ];

  // Insert ingredients into database
  allIngredients.forEach(ingredient => {
    db.run(`INSERT OR IGNORE INTO ingredients (name, category) VALUES (?, ?)`, 
      [ingredient.name, ingredient.category]);
  });
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// API Routes

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hashedPassword], function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        
        const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET);
        res.json({ token, user: { id: this.lastID, username, email } });
      });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
      res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all recipes
app.get('/api/recipes', (req, res) => {
  db.all(`SELECT * FROM recipes ORDER BY created_at DESC`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const recipes = rows.map(row => ({
      ...row,
      ingredients: JSON.parse(row.ingredients)
    }));
    
    res.json(recipes);
  });
});

// Get recipe by ID
app.get('/api/recipes/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(`SELECT * FROM recipes WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    const recipe = {
      ...row,
      ingredients: JSON.parse(row.ingredients)
    };
    
    res.json(recipe);
  });
});

// Create new recipe
app.post('/api/recipes', authenticateToken, (req, res) => {
  const { name, ingredients, instructions, difficulty, time, cuisine } = req.body;
  
  if (!name || !ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Name and ingredients array required' });
  }

  db.run(`INSERT INTO recipes (name, ingredients, instructions, difficulty, time, cuisine, user_id) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, JSON.stringify(ingredients), instructions, difficulty, time, cuisine, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ id: this.lastID, message: 'Recipe created successfully' });
    });
});

// Update recipe
app.put('/api/recipes/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, ingredients, instructions, difficulty, time, cuisine } = req.body;
  
  db.run(`UPDATE recipes SET name = ?, ingredients = ?, instructions = ?, difficulty = ?, time = ?, cuisine = ? 
          WHERE id = ? AND user_id = ?`,
    [name, JSON.stringify(ingredients), instructions, difficulty, time, cuisine, id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Recipe not found or not authorized' });
      }
      
      res.json({ message: 'Recipe updated successfully' });
    });
});

// Delete recipe
app.delete('/api/recipes/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run(`DELETE FROM recipes WHERE id = ? AND user_id = ?`, [id, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Recipe not found or not authorized' });
    }
    
    res.json({ message: 'Recipe deleted successfully' });
  });
});

// Search recipes by ingredients (Algorithmic search)
app.post('/api/recipes/search', (req, res) => {
  const { ingredients } = req.body;
  
  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Ingredients array required' });
  }

  // Get all recipes
  db.all(`SELECT * FROM recipes`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const recipes = rows.map(row => ({
      ...row,
      ingredients: JSON.parse(row.ingredients)
    }));
    
    // Apply FlavorGraph algorithms
    const results = findRecipesWithAlgorithms(recipes, ingredients);
    res.json(results);
  });
});

// Get all ingredients
app.get('/api/ingredients', (req, res) => {
  db.all(`SELECT * FROM ingredients ORDER BY name`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// FlavorGraph Algorithm Implementation
function findRecipesWithAlgorithms(recipes, availableIngredients) {
  // Graph theory: Build ingredient compatibility graph
  const ingredientGraph = buildIngredientGraph(recipes);
  
  // Backtracking algorithm
  const backtrackingResults = findRecipesWithBacktracking(recipes, availableIngredients);
  
  // Greedy algorithm
  const greedyResults = findRecipesWithGreedy(recipes, availableIngredients);
  
  // Combine and deduplicate results
  const allResults = [...backtrackingResults, ...greedyResults];
  const uniqueResults = deduplicateResults(allResults);
  
  return uniqueResults.map(recipe => ({
    ...recipe,
    matchScore: calculateMatchScore(recipe, availableIngredients),
    missingIngredients: findMissingIngredients(recipe, availableIngredients),
    substitutions: getSubstitutionRecommendations(recipe, availableIngredients)
  }));
}

function buildIngredientGraph(recipes) {
  const graph = new Map();
  const allIngredients = new Set();
  
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => allIngredients.add(ingredient));
  });
  
  allIngredients.forEach(ingredient => {
    graph.set(ingredient, new Set());
  });
  
  recipes.forEach(recipe => {
    const ingredients = recipe.ingredients;
    for (let i = 0; i < ingredients.length; i++) {
      for (let j = i + 1; j < ingredients.length; j++) {
        graph.get(ingredients[i]).add(ingredients[j]);
        graph.get(ingredients[j]).add(ingredients[i]);
      }
    }
  });
  
  return graph;
}

function findRecipesWithBacktracking(recipes, availableIngredients, targetCount = 5) {
  const results = [];
  const visited = new Set();
  
  const backtrack = (currentRecipes, depth) => {
    if (currentRecipes.length >= targetCount || depth > 10) return;
    
    for (const recipe of recipes) {
      if (visited.has(recipe.id)) continue;
      
      const matchScore = calculateMatchScore(recipe, availableIngredients);
      if (matchScore > 0) {
        visited.add(recipe.id);
        currentRecipes.push(recipe);
        backtrack(currentRecipes, depth + 1);
        currentRecipes.pop();
        visited.delete(recipe.id);
      }
    }
  };
  
  backtrack(results, 0);
  return results.sort((a, b) => calculateMatchScore(b, availableIngredients) - calculateMatchScore(a, availableIngredients));
}

function findRecipesWithGreedy(recipes, availableIngredients) {
  const results = [];
  const usedIngredients = new Set();
  
  const sortedRecipes = [...recipes].sort((a, b) => {
    const scoreA = calculateGreedyScore(a, availableIngredients);
    const scoreB = calculateGreedyScore(b, availableIngredients);
    return scoreB - scoreA;
  });
  
  for (const recipe of sortedRecipes) {
    const recipeIngredients = new Set(recipe.ingredients);
    const availableSet = new Set(availableIngredients);
    
    const canMake = [...recipeIngredients].every(ingredient => 
      availableSet.has(ingredient) && !usedIngredients.has(ingredient)
    );
    
    if (canMake) {
      recipeIngredients.forEach(ingredient => usedIngredients.add(ingredient));
      results.push({ ...recipe, matchScore: 100, missingIngredients: [] });
    } else {
      const matchScore = calculateMatchScore(recipe, availableIngredients);
      if (matchScore > 30) {
        results.push(recipe);
      }
    }
  }
  
  return results.slice(0, 8);
}

function calculateMatchScore(recipe, availableIngredients) {
  const recipeIngredients = new Set(recipe.ingredients);
  const availableSet = new Set(availableIngredients);
  
  let score = 0;
  recipeIngredients.forEach(ingredient => {
    if (availableSet.has(ingredient)) {
      score += 20;
    }
  });
  
  const maxPossible = recipeIngredients.size * 20;
  return Math.min(100, Math.round((score / maxPossible) * 100));
}

function calculateGreedyScore(recipe, availableIngredients) {
  const recipeIngredients = new Set(recipe.ingredients);
  const availableSet = new Set(availableIngredients);
  
  let score = 0;
  recipeIngredients.forEach(ingredient => {
    if (availableSet.has(ingredient)) {
      score += 1;
    }
  });
  
  score += (10 - recipeIngredients.size) * 0.1;
  return score;
}

function findMissingIngredients(recipe, availableIngredients) {
  const recipeIngredients = new Set(recipe.ingredients);
  const availableSet = new Set(availableIngredients);
  
  return [...recipeIngredients].filter(ingredient => !availableSet.has(ingredient));
}

function getSubstitutionRecommendations(recipe, availableIngredients) {
  const substitutionMap = {
    // Protein substitutions
    "chicken": ["turkey", "tofu", "fish", "shrimp", "tempeh"],
    "beef": ["lamb", "pork", "mushrooms", "tofu", "tempeh"],
    "pork": ["chicken", "turkey", "tofu", "mushrooms"],
    "fish": ["salmon", "tuna", "shrimp", "tofu"],
    "eggs": ["flax eggs", "chia eggs", "applesauce", "banana"],
    "bacon": ["turkey bacon", "mushrooms", "smoked tofu"],
    "ground beef": ["ground turkey", "ground chicken", "lentils", "mushrooms"],
    
    // Dairy substitutions
    "milk": ["almond milk", "coconut milk", "oat milk", "soy milk"],
    "cheese": ["nutritional yeast", "cashew cream", "avocado", "vegan cheese"],
    "butter": ["olive oil", "coconut oil", "avocado", "ghee"],
    "cream": ["coconut cream", "cashew cream", "almond milk"],
    "yogurt": ["coconut yogurt", "almond yogurt", "cashew cream"],
    "sour cream": ["cashew cream", "coconut cream", "greek yogurt"],
    
    // Grain substitutions
    "pasta": ["rice", "quinoa", "zucchini noodles", "spaghetti squash"],
    "rice": ["quinoa", "cauliflower rice", "barley", "bulgur"],
    "bread": ["lettuce wraps", "tortillas", "rice cakes"],
    "flour": ["almond flour", "coconut flour", "oat flour", "rice flour"],
    
    // Vegetable substitutions
    "onion": ["scallions", "leek", "shallots", "onion powder"],
    "garlic": ["garlic powder", "shallots", "chives"],
    "tomato": ["tomato sauce", "sun-dried tomatoes", "cherry tomatoes"],
    "potato": ["sweet potato", "cauliflower", "turnip"],
    "bell pepper": ["poblano pepper", "jalapeño", "cubanelle pepper"],
    "mushrooms": ["shiitake mushrooms", "portobello mushrooms", "oyster mushrooms"],
    
    // Oil substitutions
    "olive oil": ["coconut oil", "avocado oil", "vegetable oil"],
    "vegetable oil": ["olive oil", "coconut oil", "avocado oil"],
    "sesame oil": ["olive oil", "coconut oil", "peanut oil"],
    
    // Sauce substitutions
    "soy sauce": ["tamari", "coconut aminos", "worcestershire sauce"],
    "fish sauce": ["soy sauce", "worcestershire sauce", "miso paste"],
    "oyster sauce": ["hoisin sauce", "soy sauce", "teriyaki sauce"],
    "teriyaki sauce": ["soy sauce", "hoisin sauce", "bbq sauce"],
    "hot sauce": ["sriracha", "chili powder", "cayenne pepper"],
    
    // Spice substitutions
    "ginger": ["ginger powder", "galangal", "lemongrass"],
    "garlic": ["garlic powder", "shallots", "chives"],
    "onion": ["onion powder", "scallions", "leek"],
    "salt": ["sea salt", "kosher salt", "soy sauce"],
    "black pepper": ["white pepper", "cayenne pepper", "paprika"],
    
    // Herb substitutions
    "basil": ["oregano", "thyme", "parsley"],
    "cilantro": ["parsley", "mint", "dill"],
    "parsley": ["cilantro", "chives", "dill"],
    "oregano": ["basil", "thyme", "marjoram"],
    "thyme": ["oregano", "rosemary", "sage"],
    
    // Nut substitutions
    "peanuts": ["almonds", "cashews", "walnuts"],
    "almonds": ["cashews", "walnuts", "pecans"],
    "walnuts": ["pecans", "almonds", "cashews"],
    
    // Legume substitutions
    "black beans": ["kidney beans", "pinto beans", "navy beans"],
    "chickpeas": ["white beans", "cannellini beans", "lentils"],
    "lentils": ["split peas", "chickpeas", "black beans"],
    
    // Fruit substitutions
    "lemon": ["lime", "vinegar", "citric acid"],
    "lime": ["lemon", "vinegar", "citric acid"],
    "apple": ["pear", "peach", "banana"],
    "banana": ["apple", "pear", "applesauce"],
    
    // Special substitutions
    "miso paste": ["soy sauce", "tamari", "nutritional yeast"],
    "tahini": ["peanut butter", "almond butter", "cashew butter"],
    "kimchi": ["sauerkraut", "pickled vegetables", "fermented vegetables"],
    "gochujang": ["sriracha", "hot sauce", "chili paste"],
    "coconut milk": ["almond milk", "oat milk", "heavy cream"],
    "coconut cream": ["heavy cream", "cashew cream", "coconut milk"],
    
    // Sweetener substitutions
    "sugar": ["honey", "maple syrup", "agave", "stevia"],
    "honey": ["maple syrup", "agave", "brown sugar"],
    "maple syrup": ["honey", "agave", "brown sugar"],
    "brown sugar": ["white sugar", "honey", "maple syrup"],
    
    // Vinegar substitutions
    "balsamic vinegar": ["red wine vinegar", "apple cider vinegar", "lemon juice"],
    "rice vinegar": ["white vinegar", "apple cider vinegar", "lemon juice"],
    "apple cider vinegar": ["white vinegar", "rice vinegar", "lemon juice"],
    
    // Broth substitutions
    "chicken broth": ["vegetable broth", "beef broth", "water"],
    "beef broth": ["chicken broth", "vegetable broth", "water"],
    "vegetable broth": ["chicken broth", "water", "bouillon"],
    
    // Wine substitutions
    "wine": ["broth", "vinegar", "lemon juice"],
    "red wine": ["beef broth", "balsamic vinegar", "tomato juice"],
    "white wine": ["chicken broth", "white vinegar", "lemon juice"]
  };
  
  const missingIngredients = findMissingIngredients(recipe, availableIngredients);
  const substitutions = [];
  
  missingIngredients.forEach(ingredient => {
    const possibleSubs = substitutionMap[ingredient] || [];
    const availableSubs = possibleSubs.filter(sub => availableIngredients.includes(sub));
    
    if (availableSubs.length > 0) {
      substitutions.push({
        original: ingredient,
        alternatives: availableSubs,
        confidence: availableSubs.length / possibleSubs.length
      });
    }
  });
  
  return substitutions;
}

function deduplicateResults(results) {
  const seen = new Set();
  return results.filter(recipe => {
    if (seen.has(recipe.id)) return false;
    seen.add(recipe.id);
    return true;
  });
}

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`FlavorGraph server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to use the application`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
