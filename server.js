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
    {
      name: "Classic Spaghetti Carbonara",
      ingredients: ["pasta", "eggs", "bacon", "parmesan", "black pepper"],
      instructions: "Cook pasta, mix eggs with cheese, combine with hot pasta and bacon",
      difficulty: "medium",
      time: 30,
      cuisine: "italian"
    },
    {
      name: "Chicken Stir Fry",
      ingredients: ["chicken", "bell pepper", "onion", "garlic", "soy sauce", "oil"],
      instructions: "Cut chicken and vegetables, stir fry in hot oil with soy sauce",
      difficulty: "easy",
      time: 20,
      cuisine: "asian"
    },
    {
      name: "Beef Tacos",
      ingredients: ["ground beef", "tortillas", "lettuce", "tomato", "cheese", "onion"],
      instructions: "Cook ground beef with spices, serve in tortillas with toppings",
      difficulty: "easy",
      time: 25,
      cuisine: "mexican"
    },
    {
      name: "Vegetable Curry",
      ingredients: ["potato", "carrot", "onion", "coconut milk", "curry powder", "garlic"],
      instructions: "Sauté vegetables, add curry powder and coconut milk, simmer",
      difficulty: "medium",
      time: 35,
      cuisine: "indian"
    },
    {
      name: "Caesar Salad",
      ingredients: ["lettuce", "croutons", "parmesan", "lemon", "garlic", "olive oil"],
      instructions: "Mix lettuce with dressing, add croutons and parmesan",
      difficulty: "easy",
      time: 15,
      cuisine: "american"
    }
  ];

  // Insert sample recipes
  sampleRecipes.forEach(recipe => {
    db.run(`INSERT OR IGNORE INTO recipes (name, ingredients, instructions, difficulty, time, cuisine) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      [recipe.name, JSON.stringify(recipe.ingredients), recipe.instructions, 
       recipe.difficulty, recipe.time, recipe.cuisine]);
  });

  // Insert sample ingredients
  const allIngredients = new Set();
  sampleRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => allIngredients.add(ingredient));
  });

  allIngredients.forEach(ingredient => {
    db.run(`INSERT OR IGNORE INTO ingredients (name) VALUES (?)`, [ingredient]);
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
    "chicken": ["turkey", "tofu", "fish"],
    "beef": ["lamb", "pork", "mushrooms"],
    "pasta": ["rice", "quinoa", "zucchini noodles"],
    "cheese": ["nutritional yeast", "cashew cream", "avocado"],
    "milk": ["almond milk", "coconut milk", "oat milk"],
    "butter": ["olive oil", "coconut oil", "avocado"],
    "eggs": ["flax eggs", "chia eggs", "applesauce"],
    "flour": ["almond flour", "coconut flour", "oat flour"],
    "sugar": ["honey", "maple syrup", "stevia"],
    "oil": ["butter", "coconut oil", "avocado oil"]
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
