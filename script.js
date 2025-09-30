// FlavorGraph: Intelligent Recipe Navigator
// Implementing Graph Theory, Backtracking, and Greedy Algorithms

class FlavorGraph {
    constructor() {
        this.ingredients = new Set();
        this.recipeDatabase = [];
        this.ingredientGraph = new Map();
        this.substitutionMap = this.buildSubstitutionMap();
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.token = localStorage.getItem('flavorgraph_token');
        this.initializeEventListeners();
        this.loadRecipesFromAPI();
    }

    // Load recipes from API
    async loadRecipesFromAPI() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/recipes`);
            if (response.ok) {
                this.recipeDatabase = await response.json();
                this.ingredientGraph = this.buildIngredientGraph();
                console.log('Recipes loaded from API:', this.recipeDatabase.length);
            } else {
                console.error('Failed to load recipes from API');
                this.loadFallbackRecipes();
            }
        } catch (error) {
            console.error('Error loading recipes:', error);
            this.loadFallbackRecipes();
        }
    }

    // Fallback recipes if API is not available
    loadFallbackRecipes() {
        this.recipeDatabase = [
            // Italian Cuisine
            {
                id: 1,
                name: "Classic Spaghetti Carbonara",
                ingredients: ["pasta", "eggs", "bacon", "parmesan", "black pepper"],
                difficulty: "medium",
                time: 30,
                cuisine: "italian"
            },
            {
                id: 2,
                name: "Margherita Pizza",
                ingredients: ["pizza dough", "tomato sauce", "mozzarella", "basil", "olive oil"],
                difficulty: "medium",
                time: 40,
                cuisine: "italian"
            },
            {
                id: 3,
                name: "Chicken Parmesan",
                ingredients: ["chicken breast", "breadcrumbs", "eggs", "tomato sauce", "mozzarella", "parmesan"],
                difficulty: "medium",
                time: 45,
                cuisine: "italian"
            },

            // Asian Cuisine
            {
                id: 4,
                name: "Chicken Stir Fry",
                ingredients: ["chicken", "bell pepper", "onion", "garlic", "soy sauce", "oil"],
                difficulty: "easy",
                time: 20,
                cuisine: "asian"
            },
            {
                id: 5,
                name: "Beef and Broccoli",
                ingredients: ["beef", "broccoli", "garlic", "ginger", "soy sauce", "oyster sauce"],
                difficulty: "easy",
                time: 25,
                cuisine: "asian"
            },
            {
                id: 6,
                name: "Chicken Fried Rice",
                ingredients: ["rice", "chicken", "eggs", "peas", "carrot", "soy sauce", "oil"],
                difficulty: "easy",
                time: 30,
                cuisine: "asian"
            },
            {
                id: 7,
                name: "Pad Thai",
                ingredients: ["rice noodles", "shrimp", "eggs", "bean sprouts", "peanuts", "fish sauce"],
                difficulty: "medium",
                time: 30,
                cuisine: "asian"
            },

            // Mexican Cuisine
            {
                id: 8,
                name: "Beef Tacos",
                ingredients: ["ground beef", "tortillas", "lettuce", "tomato", "cheese", "onion"],
                difficulty: "easy",
                time: 25,
                cuisine: "mexican"
            },
            {
                id: 9,
                name: "Chicken Quesadillas",
                ingredients: ["chicken", "tortillas", "cheese", "bell pepper", "onion", "oil"],
                difficulty: "easy",
                time: 20,
                cuisine: "mexican"
            },
            {
                id: 10,
                name: "Beef Burritos",
                ingredients: ["ground beef", "tortillas", "rice", "beans", "cheese", "sour cream"],
                difficulty: "easy",
                time: 30,
                cuisine: "mexican"
            },

            // Indian Cuisine
            {
                id: 11,
                name: "Vegetable Curry",
                ingredients: ["potato", "carrot", "onion", "coconut milk", "curry powder", "garlic"],
                difficulty: "medium",
                time: 35,
                cuisine: "indian"
            },
            {
                id: 12,
                name: "Chicken Tikka Masala",
                ingredients: ["chicken", "yogurt", "tomato sauce", "garlic", "ginger", "garam masala"],
                difficulty: "medium",
                time: 50,
                cuisine: "indian"
            },
            {
                id: 13,
                name: "Dal Tadka",
                ingredients: ["lentils", "onion", "garlic", "cumin", "turmeric", "oil"],
                difficulty: "easy",
                time: 30,
                cuisine: "indian"
            },

            // American Cuisine
            {
                id: 14,
                name: "Caesar Salad",
                ingredients: ["lettuce", "croutons", "parmesan", "lemon", "garlic", "olive oil"],
                difficulty: "easy",
                time: 15,
                cuisine: "american"
            },
            {
                id: 15,
                name: "Beef Burger",
                ingredients: ["ground beef", "burger bun", "lettuce", "tomato", "onion", "cheese"],
                difficulty: "easy",
                time: 20,
                cuisine: "american"
            },
            {
                id: 16,
                name: "Chicken Noodle Soup",
                ingredients: ["chicken", "noodles", "carrot", "celery", "onion", "garlic"],
                difficulty: "easy",
                time: 30,
                cuisine: "american"
            },
            {
                id: 17,
                name: "Mac and Cheese",
                ingredients: ["pasta", "cheese", "milk", "butter", "flour", "breadcrumbs"],
                difficulty: "easy",
                time: 35,
                cuisine: "american"
            },

            // Mediterranean Cuisine
            {
                id: 18,
                name: "Greek Salad",
                ingredients: ["tomato", "cucumber", "olives", "feta cheese", "olive oil", "oregano"],
                difficulty: "easy",
                time: 15,
                cuisine: "mediterranean"
            },
            {
                id: 19,
                name: "Hummus",
                ingredients: ["chickpeas", "tahini", "lemon", "garlic", "olive oil", "cumin"],
                difficulty: "easy",
                time: 15,
                cuisine: "mediterranean"
            },
            {
                id: 20,
                name: "Falafel",
                ingredients: ["chickpeas", "onion", "garlic", "parsley", "cumin", "flour"],
                difficulty: "medium",
                time: 40,
                cuisine: "mediterranean"
            },

            // Thai Cuisine
            {
                id: 21,
                name: "Green Curry",
                ingredients: ["chicken", "green curry paste", "coconut milk", "eggplant", "basil", "fish sauce"],
                difficulty: "medium",
                time: 30,
                cuisine: "thai"
            },
            {
                id: 22,
                name: "Tom Yum Soup",
                ingredients: ["shrimp", "lemongrass", "lime", "chili", "mushrooms", "fish sauce"],
                difficulty: "medium",
                time: 25,
                cuisine: "thai"
            },

            // Chinese Cuisine
            {
                id: 23,
                name: "Kung Pao Chicken",
                ingredients: ["chicken", "peanuts", "bell pepper", "chili", "soy sauce", "vinegar"],
                difficulty: "medium",
                time: 25,
                cuisine: "chinese"
            },
            {
                id: 24,
                name: "Sweet and Sour Chicken",
                ingredients: ["chicken", "bell pepper", "pineapple", "vinegar", "sugar", "ketchup"],
                difficulty: "medium",
                time: 30,
                cuisine: "chinese"
            },

            // Japanese Cuisine
            {
                id: 25,
                name: "Chicken Teriyaki",
                ingredients: ["chicken", "teriyaki sauce", "garlic", "ginger", "sesame seeds"],
                difficulty: "easy",
                time: 25,
                cuisine: "japanese"
            },
            {
                id: 26,
                name: "Tempura",
                ingredients: ["shrimp", "flour", "eggs", "oil", "dipping sauce", "vegetables"],
                difficulty: "medium",
                time: 30,
                cuisine: "japanese"
            },

            // Korean Cuisine
            {
                id: 27,
                name: "Bulgogi",
                ingredients: ["beef", "soy sauce", "garlic", "ginger", "sesame oil", "pear"],
                difficulty: "easy",
                time: 30,
                cuisine: "korean"
            },
            {
                id: 28,
                name: "Kimchi Fried Rice",
                ingredients: ["rice", "kimchi", "eggs", "green onions", "soy sauce", "oil"],
                difficulty: "easy",
                time: 20,
                cuisine: "korean"
            },

            // British Cuisine
            {
                id: 29,
                name: "Fish and Chips",
                ingredients: ["fish", "potato", "flour", "oil", "lemon", "salt"],
                difficulty: "medium",
                time: 45,
                cuisine: "british"
            },
            {
                id: 30,
                name: "Shepherd's Pie",
                ingredients: ["ground lamb", "potato", "onion", "carrot", "peas", "gravy"],
                difficulty: "medium",
                time: 60,
                cuisine: "british"
            },

            // Spanish Cuisine
            {
                id: 31,
                name: "Paella",
                ingredients: ["rice", "chicken", "shrimp", "saffron", "bell pepper", "onion"],
                difficulty: "hard",
                time: 50,
                cuisine: "spanish"
            },
            {
                id: 32,
                name: "Gazpacho",
                ingredients: ["tomato", "cucumber", "bell pepper", "onion", "garlic", "olive oil"],
                difficulty: "easy",
                time: 20,
                cuisine: "spanish"
            },

            // Vegetarian Options
            {
                id: 33,
                name: "Vegetarian Chili",
                ingredients: ["beans", "tomato", "onion", "bell pepper", "chili powder", "garlic"],
                difficulty: "easy",
                time: 40,
                cuisine: "vegetarian"
            },
            {
                id: 34,
                name: "Quinoa Salad",
                ingredients: ["quinoa", "cucumber", "tomato", "onion", "lemon", "olive oil"],
                difficulty: "easy",
                time: 25,
                cuisine: "vegetarian"
            },
            {
                id: 35,
                name: "Veggie Burger",
                ingredients: ["black beans", "oats", "onion", "garlic", "spices", "egg"],
                difficulty: "medium",
                time: 35,
                cuisine: "vegetarian"
            }
        ];
        this.ingredientGraph = this.buildIngredientGraph();
    }

    // Build ingredient relationship graph using graph theory
    buildIngredientGraph() {
        const graph = new Map();
        
        // Initialize graph with all ingredients
        const allIngredients = new Set();
        this.recipeDatabase.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => {
                allIngredients.add(ingredient);
            });
        });

        // Build adjacency list
        allIngredients.forEach(ingredient => {
            graph.set(ingredient, new Set());
        });

        // Add edges based on co-occurrence in recipes
        this.recipeDatabase.forEach(recipe => {
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

    // Build ingredient substitution map
    buildSubstitutionMap() {
        return {
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
    }

    // Backtracking algorithm for recipe suggestions
    findRecipesWithBacktracking(availableIngredients, targetRecipeCount = 5) {
        const results = [];
        const visited = new Set();

        const backtrack = (currentIngredients, currentRecipes, depth) => {
            if (currentRecipes.length >= targetRecipeCount || depth > 10) {
                return;
            }

            for (const recipe of this.recipeDatabase) {
                if (visited.has(recipe.id)) continue;

                const matchScore = this.calculateMatchScore(recipe, currentIngredients);
                if (matchScore > 0) {
                    visited.add(recipe.id);
                    currentRecipes.push({
                        ...recipe,
                        matchScore,
                        missingIngredients: this.findMissingIngredients(recipe, currentIngredients)
                    });
                    
                    // Recursive call
                    backtrack(currentIngredients, currentRecipes, depth + 1);
                    
                    // Backtrack
                    currentRecipes.pop();
                    visited.delete(recipe.id);
                }
            }
        };

        backtrack(availableIngredients, results, 0);
        return results.sort((a, b) => b.matchScore - a.matchScore);
    }

    // Greedy algorithm for optimal ingredient usage
    findRecipesWithGreedy(availableIngredients) {
        const results = [];
        const usedIngredients = new Set();
        const remainingRecipes = [...this.recipeDatabase];

        // Sort recipes by potential score (greedy choice)
        remainingRecipes.sort((a, b) => {
            const scoreA = this.calculateGreedyScore(a, availableIngredients);
            const scoreB = this.calculateGreedyScore(b, availableIngredients);
            return scoreB - scoreA;
        });

        for (const recipe of remainingRecipes) {
            const recipeIngredients = new Set(recipe.ingredients);
            const availableSet = new Set(availableIngredients);
            
            // Check if we can make this recipe
            const canMake = [...recipeIngredients].every(ingredient => 
                availableSet.has(ingredient) && !usedIngredients.has(ingredient)
            );

            if (canMake) {
                // Mark ingredients as used
                recipeIngredients.forEach(ingredient => usedIngredients.add(ingredient));
                
                results.push({
                    ...recipe,
                    matchScore: 100,
                    missingIngredients: [],
                    usedIngredients: [...recipeIngredients]
                });
            } else {
                // Calculate partial match
                const matchScore = this.calculateMatchScore(recipe, availableIngredients);
                if (matchScore > 30) {
                    results.push({
                        ...recipe,
                        matchScore,
                        missingIngredients: this.findMissingIngredients(recipe, availableIngredients)
                    });
                }
            }
        }

        return results.slice(0, 8);
    }

    // Calculate match score using graph theory
    calculateMatchScore(recipe, availableIngredients) {
        const recipeIngredients = new Set(recipe.ingredients);
        const availableSet = new Set(availableIngredients);
        
        let score = 0;
        let ingredientScore = 0;
        
        // Direct ingredient matches
        recipeIngredients.forEach(ingredient => {
            if (availableSet.has(ingredient)) {
                ingredientScore += 20;
            }
        });

        // Graph-based scoring (ingredients that work well together)
        recipeIngredients.forEach(ingredient => {
            if (availableSet.has(ingredient)) {
                const neighbors = this.ingredientGraph.get(ingredient) || new Set();
                neighbors.forEach(neighbor => {
                    if (availableSet.has(neighbor)) {
                        score += 5; // Bonus for compatible ingredients
                    }
                });
            }
        });

        // Calculate percentage
        const totalScore = ingredientScore + score;
        const maxPossible = recipeIngredients.size * 20;
        return Math.min(100, Math.round((totalScore / maxPossible) * 100));
    }

    // Greedy scoring function
    calculateGreedyScore(recipe, availableIngredients) {
        const recipeIngredients = new Set(recipe.ingredients);
        const availableSet = new Set(availableIngredients);
        
        let score = 0;
        recipeIngredients.forEach(ingredient => {
            if (availableSet.has(ingredient)) {
                score += 1;
            }
        });

        // Bonus for recipes with fewer ingredients (easier to make)
        score += (10 - recipeIngredients.size) * 0.1;
        
        return score;
    }

    // Find missing ingredients
    findMissingIngredients(recipe, availableIngredients) {
        const recipeIngredients = new Set(recipe.ingredients);
        const availableSet = new Set(availableIngredients);
        
        return [...recipeIngredients].filter(ingredient => 
            !availableSet.has(ingredient)
        );
    }

    // Get substitution recommendations
    getSubstitutionRecommendations(recipe, availableIngredients) {
        const missingIngredients = this.findMissingIngredients(recipe, availableIngredients);
        const substitutions = [];

        missingIngredients.forEach(ingredient => {
            const possibleSubs = this.substitutionMap[ingredient] || [];
            const availableSubs = possibleSubs.filter(sub => 
                availableIngredients.includes(sub)
            );

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

    // Initialize event listeners
    initializeEventListeners() {
        const ingredientInput = document.getElementById('ingredientInput');
        const addButton = document.getElementById('addIngredient');
        const findButton = document.getElementById('findRecipes');
        const clearButton = document.getElementById('clearIngredients');
        const tabButtons = document.querySelectorAll('.tab-btn');

        // Add ingredient
        addButton.addEventListener('click', () => this.addIngredient());
        ingredientInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addIngredient();
        });

        // Find recipes
        findButton.addEventListener('click', () => this.findRecipes());

        // Clear ingredients
        clearButton.addEventListener('click', () => this.clearIngredients());

        // Tab switching
        tabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
        });
    }

    // Add ingredient to the list
    addIngredient() {
        const input = document.getElementById('ingredientInput');
        const ingredient = input.value.trim().toLowerCase();
        
        if (ingredient && !this.ingredients.has(ingredient)) {
            this.ingredients.add(ingredient);
            this.updateIngredientList();
            input.value = '';
        }
    }

    // Update ingredient list display
    updateIngredientList() {
        const container = document.getElementById('ingredientList');
        container.innerHTML = '';

        this.ingredients.forEach(ingredient => {
            const tag = document.createElement('div');
            tag.className = 'ingredient-tag';
            tag.innerHTML = `
                ${ingredient}
                <span class="remove" onclick="flavorGraph.removeIngredient('${ingredient}')">×</span>
            `;
            container.appendChild(tag);
        });
    }

    // Remove ingredient
    removeIngredient(ingredient) {
        this.ingredients.delete(ingredient);
        this.updateIngredientList();
    }

    // Clear all ingredients
    clearIngredients() {
        this.ingredients.clear();
        this.updateIngredientList();
        this.clearResults();
    }

    // Find recipes using API
    async findRecipes() {
        if (this.ingredients.size === 0) {
            alert('Please add some ingredients first!');
            return;
        }

        this.showLoading();
        
        try {
            const availableIngredients = [...this.ingredients];
            const response = await fetch(`${this.apiBaseUrl}/recipes/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredients: availableIngredients })
            });

            if (response.ok) {
                const results = await response.json();
                this.displayResults(results, availableIngredients);
            } else {
                // Fallback to local algorithms
                const backtrackingResults = this.findRecipesWithBacktracking(availableIngredients);
                const greedyResults = this.findRecipesWithGreedy(availableIngredients);
                const allResults = [...backtrackingResults, ...greedyResults];
                const uniqueResults = this.deduplicateResults(allResults);
                this.displayResults(uniqueResults, availableIngredients);
            }
        } catch (error) {
            console.error('Error searching recipes:', error);
            // Fallback to local algorithms
            const availableIngredients = [...this.ingredients];
            const backtrackingResults = this.findRecipesWithBacktracking(availableIngredients);
            const greedyResults = this.findRecipesWithGreedy(availableIngredients);
            const allResults = [...backtrackingResults, ...greedyResults];
            const uniqueResults = this.deduplicateResults(allResults);
            this.displayResults(uniqueResults, availableIngredients);
        }
    }

    // Deduplicate results
    deduplicateResults(results) {
        const seen = new Set();
        return results.filter(recipe => {
            if (seen.has(recipe.id)) return false;
            seen.add(recipe.id);
            return true;
        });
    }

    // Display results
    displayResults(recipes, availableIngredients) {
        this.displayRecipes(recipes, availableIngredients);
        this.displayGapAnalysis(recipes, availableIngredients);
        this.displaySubstitutions(recipes, availableIngredients);
    }

    // Display recipe results
    displayRecipes(recipes, availableIngredients) {
        const container = document.getElementById('recipeResults');
        
        if (recipes.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No recipes found</h3>
                    <p>Try adding more ingredients or check the substitutions tab for alternatives.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recipes.map(recipe => `
            <div class="recipe-card">
                <div class="recipe-title">${recipe.name}</div>
                <div class="recipe-score">Match: ${recipe.matchScore}%</div>
                <div class="recipe-ingredients">
                    <h4>Ingredients:</h4>
                    ${recipe.ingredients.map(ingredient => `
                        <div class="ingredient-item ${availableIngredients.includes(ingredient) ? 'available' : 'missing'}">
                            <i class="fas fa-${availableIngredients.includes(ingredient) ? 'check' : 'times'}"></i>
                            ${ingredient}
                        </div>
                    `).join('')}
                </div>
                <div class="recipe-meta">
                    <small>Difficulty: ${recipe.difficulty} | Time: ${recipe.time}min | ${recipe.cuisine}</small>
                </div>
            </div>
        `).join('');
    }

    // Display gap analysis
    displayGapAnalysis(recipes, availableIngredients) {
        const container = document.getElementById('gapResults');
        
        if (recipes.length === 0) {
            container.innerHTML = '<div class="no-results">No recipes to analyze</div>';
            return;
        }

        const gapAnalysis = recipes.map(recipe => {
            const missing = this.findMissingIngredients(recipe, availableIngredients);
            return {
                recipe: recipe.name,
                missing: missing,
                count: missing.length,
                percentage: Math.round((missing.length / recipe.ingredients.length) * 100)
            };
        }).filter(item => item.count > 0);

        if (gapAnalysis.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-check-circle"></i>
                    <h3>Perfect matches found!</h3>
                    <p>You have all ingredients for some recipes.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = gapAnalysis.map(item => `
            <div class="gap-item">
                <h4>${item.recipe}</h4>
                <p>Missing ${item.count} ingredients (${item.percentage}%):</p>
                <ul>
                    ${item.missing.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // Display substitution recommendations
    displaySubstitutions(recipes, availableIngredients) {
        const container = document.getElementById('substitutionResults');
        
        if (recipes.length === 0) {
            container.innerHTML = '<div class="no-results">No recipes to analyze</div>';
            return;
        }

        const allSubstitutions = [];
        
        recipes.forEach(recipe => {
            const substitutions = this.getSubstitutionRecommendations(recipe, availableIngredients);
            if (substitutions.length > 0) {
                allSubstitutions.push({
                    recipe: recipe.name,
                    substitutions: substitutions
                });
            }
        });

        if (allSubstitutions.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-info-circle"></i>
                    <h3>No substitutions available</h3>
                    <p>Try adding more diverse ingredients to your list.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = allSubstitutions.map(item => `
            <div class="substitution-item">
                <h4>${item.recipe}</h4>
                ${item.substitutions.map(sub => `
                    <p><strong>${sub.original}</strong> can be replaced with: ${sub.alternatives.join(', ')}</p>
                `).join('')}
            </div>
        `).join('');
    }

    // Show loading state
    showLoading() {
        const containers = ['recipeResults', 'gapResults', 'substitutionResults'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            container.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner"></i>
                    <p>Analyzing ingredients with algorithmic intelligence...</p>
                </div>
            `;
        });
    }

    // Clear all results
    clearResults() {
        const containers = ['recipeResults', 'gapResults', 'substitutionResults'];
        containers.forEach(id => {
            document.getElementById(id).innerHTML = '';
        });
    }

    // Switch tabs
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }
}

// Initialize the application
const flavorGraph = new FlavorGraph();
