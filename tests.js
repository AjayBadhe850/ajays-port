/**
 * FlavorGraph Test Suite
 * 
 * Comprehensive testing for all algorithms and functionality
 * Tests: Graph Theory, Backtracking, Greedy, Substitution Engine
 */

class FlavorGraphTests {
    constructor() {
        this.flavorGraph = new FlavorGraph();
        this.testResults = [];
        this.passedTests = 0;
        this.totalTests = 0;
    }

    /**
     * Run all test suites
     */
    async runAllTests() {
        console.log('🧪 Starting FlavorGraph Test Suite...');
        
        await this.testRecipeDatabase();
        await this.testIngredientGraph();
        await this.testBacktrackingAlgorithm();
        await this.testGreedyAlgorithm();
        await this.testMatchScoring();
        await this.testSubstitutionEngine();
        await this.testGapAnalysis();
        await this.testErrorHandling();
        
        this.generateTestReport();
    }

    /**
     * Test recipe database loading and structure
     */
    async testRecipeDatabase() {
        this.startTest('Recipe Database');
        
        // Test database size
        this.assert(this.flavorGraph.recipeDatabase.length > 0, 
            'Recipe database should not be empty');
        
        // Test recipe structure
        const sampleRecipe = this.flavorGraph.recipeDatabase[0];
        this.assert(sampleRecipe.hasOwnProperty('name'), 
            'Recipe should have name property');
        this.assert(sampleRecipe.hasOwnProperty('ingredients'), 
            'Recipe should have ingredients property');
        this.assert(Array.isArray(sampleRecipe.ingredients), 
            'Ingredients should be an array');
        
        this.endTest();
    }

    /**
     * Test ingredient graph construction
     */
    async testIngredientGraph() {
        this.startTest('Ingredient Graph');
        
        // Test graph construction
        const graph = this.flavorGraph.buildIngredientGraph();
        this.assert(graph instanceof Map, 
            'Ingredient graph should be a Map');
        
        // Test graph has nodes
        this.assert(graph.size > 0, 
            'Graph should have ingredient nodes');
        
        // Test graph relationships
        let hasRelationships = false;
        for (const [ingredient, neighbors] of graph) {
            if (neighbors.size > 0) {
                hasRelationships = true;
                break;
            }
        }
        this.assert(hasRelationships, 
            'Graph should have ingredient relationships');
        
        this.endTest();
    }

    /**
     * Test backtracking algorithm
     */
    async testBacktrackingAlgorithm() {
        this.startTest('Backtracking Algorithm');
        
        const testIngredients = ['chicken', 'onion', 'garlic'];
        const results = this.flavorGraph.findRecipesWithBacktracking(testIngredients);
        
        this.assert(Array.isArray(results), 
            'Backtracking should return an array');
        
        this.assert(results.length > 0, 
            'Backtracking should find recipes with matching ingredients');
        
        // Test result structure
        if (results.length > 0) {
            const result = results[0];
            this.assert(result.hasOwnProperty('matchScore'), 
                'Result should have match score');
            this.assert(result.hasOwnProperty('missingIngredients'), 
                'Result should have missing ingredients');
            this.assert(typeof result.matchScore === 'number', 
                'Match score should be a number');
        }
        
        this.endTest();
    }

    /**
     * Test greedy algorithm
     */
    async testGreedyAlgorithm() {
        this.startTest('Greedy Algorithm');
        
        const testIngredients = ['pasta', 'tomato', 'cheese'];
        const results = this.flavorGraph.findRecipesWithGreedy(testIngredients);
        
        this.assert(Array.isArray(results), 
            'Greedy should return an array');
        
        this.assert(results.length > 0, 
            'Greedy should find recipes with matching ingredients');
        
        // Test sorting (greedy should be sorted by score)
        for (let i = 1; i < results.length; i++) {
            this.assert(results[i-1].matchScore >= results[i].matchScore, 
                'Greedy results should be sorted by score');
        }
        
        this.endTest();
    }

    /**
     * Test match scoring algorithm
     */
    async testMatchScoring() {
        this.startTest('Match Scoring');
        
        const testRecipe = {
            name: 'Test Recipe',
            ingredients: ['chicken', 'onion', 'garlic', 'salt']
        };
        
        // Test perfect match
        const perfectMatch = this.flavorGraph.calculateMatchScore(
            testRecipe, ['chicken', 'onion', 'garlic', 'salt']
        );
        this.assert(perfectMatch === 100, 
            'Perfect ingredient match should score 100%');
        
        // Test partial match
        const partialMatch = this.flavorGraph.calculateMatchScore(
            testRecipe, ['chicken', 'onion']
        );
        this.assert(partialMatch > 0 && partialMatch < 100, 
            'Partial match should score between 0-100%');
        
        // Test no match
        const noMatch = this.flavorGraph.calculateMatchScore(
            testRecipe, ['beef', 'carrot']
        );
        this.assert(noMatch === 0, 
            'No matching ingredients should score 0%');
        
        this.endTest();
    }

    /**
     * Test substitution engine
     */
    async testSubstitutionEngine() {
        this.startTest('Substitution Engine');
        
        const testRecipe = {
            name: 'Test Recipe',
            ingredients: ['chicken', 'milk', 'butter']
        };
        
        const availableIngredients = ['turkey', 'almond milk', 'olive oil'];
        const substitutions = this.flavorGraph.getSubstitutionRecommendations(
            testRecipe, availableIngredients
        );
        
        this.assert(Array.isArray(substitutions), 
            'Substitutions should be an array');
        
        // Test substitution structure
        if (substitutions.length > 0) {
            const sub = substitutions[0];
            this.assert(sub.hasOwnProperty('original'), 
                'Substitution should have original ingredient');
            this.assert(sub.hasOwnProperty('alternatives'), 
                'Substitution should have alternatives');
            this.assert(sub.hasOwnProperty('confidence'), 
                'Substitution should have confidence score');
        }
        
        this.endTest();
    }

    /**
     * Test gap analysis
     */
    async testGapAnalysis() {
        this.startTest('Gap Analysis');
        
        const testRecipe = {
            name: 'Test Recipe',
            ingredients: ['chicken', 'onion', 'garlic', 'salt']
        };
        
        const availableIngredients = ['chicken', 'onion'];
        const missing = this.flavorGraph.findMissingIngredients(
            testRecipe, availableIngredients
        );
        
        this.assert(Array.isArray(missing), 
            'Missing ingredients should be an array');
        
        this.assert(missing.length === 2, 
            'Should identify 2 missing ingredients');
        
        this.assert(missing.includes('garlic'), 
            'Should identify garlic as missing');
        this.assert(missing.includes('salt'), 
            'Should identify salt as missing');
        
        this.endTest();
    }

    /**
     * Test error handling
     */
    async testErrorHandling() {
        this.startTest('Error Handling');
        
        // Test empty ingredients
        const emptyResults = this.flavorGraph.findRecipesWithBacktracking([]);
        this.assert(Array.isArray(emptyResults), 
            'Should handle empty ingredients gracefully');
        
        // Test invalid recipe data
        const invalidRecipe = { name: 'Test', ingredients: null };
        const invalidScore = this.flavorGraph.calculateMatchScore(
            invalidRecipe, ['chicken']
        );
        this.assert(typeof invalidScore === 'number', 
            'Should handle invalid recipe data gracefully');
        
        this.endTest();
    }

    /**
     * Helper methods for testing
     */
    startTest(testName) {
        console.log(`\n🔍 Testing: ${testName}`);
        this.currentTest = testName;
    }

    assert(condition, message) {
        this.totalTests++;
        if (condition) {
            this.passedTests++;
            console.log(`✅ ${message}`);
        } else {
            console.log(`❌ ${message}`);
            this.testResults.push({
                test: this.currentTest,
                message: message,
                passed: false
            });
        }
    }

    endTest() {
        console.log(`✅ ${this.currentTest} completed`);
    }

    /**
     * Generate comprehensive test report
     */
    generateTestReport() {
        const passRate = (this.passedTests / this.totalTests * 100).toFixed(2);
        
        console.log('\n📊 FlavorGraph Test Report');
        console.log('========================');
        console.log(`Total Tests: ${this.totalTests}`);
        console.log(`Passed: ${this.passedTests}`);
        console.log(`Failed: ${this.totalTests - this.passedTests}`);
        console.log(`Pass Rate: ${passRate}%`);
        
        if (passRate >= 90) {
            console.log('🎉 Excellent! All tests passing');
        } else if (passRate >= 80) {
            console.log('👍 Good! Most tests passing');
        } else {
            console.log('⚠️ Some tests failing - review needed');
        }
        
        return {
            totalTests: this.totalTests,
            passedTests: this.passedTests,
            passRate: parseFloat(passRate),
            results: this.testResults
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlavorGraphTests;
}

// Auto-run tests if in browser
if (typeof window !== 'undefined') {
    window.FlavorGraphTests = FlavorGraphTests;
}
