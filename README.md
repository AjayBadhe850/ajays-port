# FlavorGraph: Intelligent Recipe Navigator

![FlavorGraph Logo](https://img.shields.io/badge/FlavorGraph-Recipe%20Navigator-blue?style=for-the-badge&logo=utensils)

An intelligent recipe suggestion system that leverages **graph theory**, **backtracking algorithms**, and **greedy optimization** to provide smart recipe recommendations based on available ingredients.

## 🚀 Features

### 🧠 Algorithmic Intelligence
- **Graph Theory**: Builds ingredient relationship graphs for compatibility analysis
- **Backtracking Algorithm**: Finds optimal recipe combinations through systematic exploration
- **Greedy Algorithm**: Provides quick, efficient recipe suggestions
- **Gap Analysis**: Identifies missing ingredients for each recipe
- **Substitution Engine**: Smart ingredient replacement recommendations

### 🎯 Core Functionality
- **Ingredient Input**: Add available ingredients with intuitive interface
- **Recipe Matching**: Find recipes based on ingredient availability
- **Match Scoring**: Algorithmic scoring system (0-100%) for recipe compatibility
- **Missing Ingredients**: Detailed analysis of what's needed for each recipe
- **Substitution Suggestions**: Alternative ingredients based on compatibility

### 🎨 User Experience
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Results**: Instant recipe suggestions with loading states
- **Tabbed Interface**: Organized view of recipes, gaps, and substitutions
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Algorithms**: Graph Theory, Backtracking, Greedy Optimization
- **Styling**: CSS Grid, Flexbox, CSS Animations
- **Icons**: Font Awesome
- **Deployment**: GitHub Pages (Static Hosting)

## 📊 Algorithm Details

### Graph Theory Implementation
```javascript
// Builds ingredient relationship graph
buildIngredientGraph() {
    const graph = new Map();
    // Creates adjacency list based on co-occurrence in recipes
    // Enables compatibility scoring and relationship analysis
}
```

### Backtracking Algorithm
```javascript
// Systematic recipe exploration
findRecipesWithBacktracking(availableIngredients, targetRecipeCount) {
    // Uses recursive backtracking to find optimal combinations
    // Explores all possible recipe combinations
    // Returns best matches based on ingredient availability
}
```

### Greedy Algorithm
```javascript
// Efficient recipe selection
findRecipesWithGreedy(availableIngredients) {
    // Makes locally optimal choices at each step
    // Prioritizes recipes with highest immediate benefit
    // Provides quick, efficient suggestions
}
```

## 🎮 How to Use

1. **Add Ingredients**: Type ingredient names and click "Add" or press Enter
2. **Find Recipes**: Click "Find Recipes" to get algorithmic suggestions
3. **View Results**: Browse through three tabs:
   - **Recipes**: See suggested recipes with match scores
   - **Missing Ingredients**: Analyze what you need for each recipe
   - **Substitutions**: Get alternative ingredient recommendations

## 📈 Performance Features

- **Efficient Algorithms**: O(n²) complexity for graph building, O(n!) for backtracking
- **Smart Caching**: Ingredient relationships cached for fast lookups
- **Optimized UI**: Smooth animations and responsive design
- **Memory Efficient**: Minimal memory footprint with Set-based data structures

## 🎯 Recipe Database

The system includes a comprehensive recipe database with:
- **10+ Recipes**: Diverse cuisines (Italian, Asian, Mexican, Indian, etc.)
- **Ingredient Relationships**: Mapped compatibility between ingredients
- **Substitution Rules**: Smart replacement recommendations
- **Difficulty Levels**: Easy, Medium, Hard classifications
- **Cooking Times**: Estimated preparation times

## 🔧 Customization

### Adding New Recipes
```javascript
// Add to recipeDatabase array
{
    id: 11,
    name: "Your Recipe Name",
    ingredients: ["ingredient1", "ingredient2", "ingredient3"],
    difficulty: "easy",
    time: 30,
    cuisine: "your-cuisine"
}
```

### Extending Substitutions
```javascript
// Add to substitutionMap
"ingredient": ["substitute1", "substitute2", "substitute3"]
```

## 🌐 Deployment

### GitHub Pages
1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main`)
4. Access your site at `https://yourusername.github.io/FlavorGraph`

### Local Development
1. Clone the repository
2. Open `index.html` in a web browser
3. Start adding ingredients and exploring recipes!

## 📱 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Algorithm Inspiration**: Graph theory and combinatorial optimization
- **UI Design**: Modern web design principles
- **Icons**: Font Awesome icon library
- **Hosting**: GitHub Pages for static hosting

## 📞 Support

If you have any questions or suggestions, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**FlavorGraph** - *Powered by Graph Theory & Algorithmic Intelligence* 🧠✨
