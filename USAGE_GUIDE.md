# FlavorGraph Usage Guide

## 🍽️ How to Use FlavorGraph: Step-by-Step Examples

### **Live Website**: `https://ajaybadhe850.github.io/ajays-port/`

---

## 📋 Example 1: Finding Italian Recipes

### **Step 1: Add Ingredients**
1. Open the FlavorGraph website
2. In the ingredient input field, type: `pasta`
3. Click "Add" or press Enter
4. Add more ingredients: `eggs`, `bacon`, `parmesan`
5. Your ingredient list will show: `pasta`, `eggs`, `bacon`, `parmesan`

### **Step 2: Find Recipes**
1. Click the green "Find Recipes" button
2. Wait for the algorithms to process (1-2 seconds)
3. View results in the "Recipes" tab

### **Expected Results:**
- **Classic Spaghetti Carbonara** (100% match)
- **Pasta Primavera** (60% match)
- **Chicken Parmesan** (40% match)

### **Step 3: Analyze Results**
- **Recipes Tab**: Shows all suggested recipes with match scores
- **Missing Ingredients Tab**: Lists what you need for each recipe
- **Substitutions Tab**: Suggests alternatives for missing ingredients

---

## 🌮 Example 2: Mexican Cuisine Search

### **Ingredients to Add:**
```
ground beef
tortillas
lettuce
tomato
cheese
onion
```

### **Expected Results:**
- **Beef Tacos** (100% match)
- **Chicken Quesadillas** (60% match)
- **Beef Burritos** (80% match)

### **Missing Ingredients Analysis:**
- For Chicken Quesadillas: Missing `chicken`, `bell pepper`
- Substitution suggestions: Use `ground beef` instead of `chicken`

---

## 🥢 Example 3: Asian Cuisine Discovery

### **Ingredients to Add:**
```
chicken
bell pepper
onion
garlic
soy sauce
oil
```

### **Expected Results:**
- **Chicken Stir Fry** (100% match)
- **Beef and Broccoli** (60% match)
- **Chicken Fried Rice** (80% match)

### **Algorithm Insights:**
- **Graph Theory**: Identifies `chicken` + `garlic` + `soy sauce` as compatible
- **Backtracking**: Explores all possible Asian recipe combinations
- **Greedy**: Prioritizes recipes with highest ingredient overlap

---

## 🥗 Example 4: Vegetarian Options

### **Ingredients to Add:**
```
beans
tomato
onion
bell pepper
chili powder
garlic
```

### **Expected Results:**
- **Vegetarian Chili** (100% match)
- **Quinoa Salad** (40% match)
- **Veggie Burger** (60% match)

### **Substitution Engine:**
- Missing `quinoa`? Use `rice` or `barley`
- Missing `black beans`? Use `kidney beans` or `pinto beans`

---

## 🔍 Example 5: Advanced Search with Substitutions

### **Scenario**: You have limited ingredients but want to cook

### **Available Ingredients:**
```
chicken
onion
garlic
olive oil
salt
```

### **What Happens:**
1. **Recipes Found**: Multiple recipes with partial matches
2. **Gap Analysis**: Shows missing ingredients for each recipe
3. **Substitutions**: Suggests alternatives you might have

### **Example Substitutions:**
- Missing `butter`? Use `olive oil`
- Missing `pepper`? Use `salt` or `garlic powder`
- Missing `cheese`? Use `nutritional yeast` or `avocado`

---

## 🎯 Pro Tips for Best Results

### **1. Start with Protein**
- Add your main protein first: `chicken`, `beef`, `fish`, `tofu`

### **2. Add Common Vegetables**
- Include basics: `onion`, `garlic`, `tomato`, `bell pepper`

### **3. Include Staples**
- Add pantry items: `oil`, `salt`, `pepper`, `flour`

### **4. Use Specific Ingredients**
- Instead of `cheese`, try `mozzarella`, `parmesan`, `cheddar`
- Instead of `meat`, try `chicken`, `beef`, `pork`

### **5. Explore Substitutions**
- Check the Substitutions tab for creative alternatives
- Use confidence scores to choose best alternatives

---

## 🧮 Understanding the Algorithms

### **Graph Theory (Blue Tab)**
- Analyzes ingredient relationships
- Finds compatible ingredient combinations
- Provides compatibility scoring

### **Backtracking (Green Tab)**
- Systematically explores all recipe possibilities
- Finds optimal ingredient combinations
- Provides comprehensive results

### **Greedy (Orange Tab)**
- Makes efficient, quick decisions
- Prioritizes highest-scoring recipes
- Provides fast results

---

## 📊 Reading the Results

### **Match Score (0-100%)**
- **100%**: You have all ingredients
- **80-99%**: Missing 1-2 ingredients
- **60-79%**: Missing 2-3 ingredients
- **40-59%**: Missing 3-4 ingredients
- **20-39%**: Missing most ingredients

### **Missing Ingredients**
- Red ❌: Ingredient you don't have
- Green ✅: Ingredient you have

### **Substitution Confidence**
- **High (80-100%)**: Excellent alternative
- **Medium (50-79%)**: Good alternative
- **Low (20-49%)**: Acceptable alternative

---

## 🚀 Advanced Features

### **1. Dietary Restrictions**
- Add `tofu` instead of `chicken` for vegetarian
- Add `almond milk` instead of `milk` for dairy-free
- Add `gluten-free flour` instead of `flour`

### **2. Cultural Cuisine Focus**
- **Italian**: `pasta`, `tomato`, `basil`, `olive oil`
- **Asian**: `soy sauce`, `ginger`, `sesame oil`, `rice`
- **Mexican**: `tortillas`, `cilantro`, `lime`, `cumin`
- **Indian**: `curry powder`, `coconut milk`, `turmeric`

### **3. Cooking Skill Level**
- **Easy**: Look for recipes with 5-6 ingredients
- **Medium**: Try recipes with 7-8 ingredients
- **Hard**: Challenge yourself with 9+ ingredient recipes

---

## 🎮 Interactive Demo

### **Try These Combinations:**

#### **Beginner Friendly:**
```
chicken + onion + garlic + oil + salt
```

#### **Intermediate:**
```
beef + bell pepper + onion + garlic + soy sauce + oil + rice
```

#### **Advanced:**
```
salmon + asparagus + lemon + dill + butter + white wine + garlic + onion
```

---

## 🔧 Troubleshooting

### **No Results Found?**
1. Try adding more common ingredients
2. Check spelling of ingredients
3. Use singular forms: `onion` not `onions`
4. Try broader terms: `cheese` instead of `mozzarella`

### **Low Match Scores?**
1. Add more ingredients to your list
2. Include basic pantry staples
3. Check substitution suggestions
4. Try different cuisine styles

### **Website Not Loading?**
1. Check internet connection
2. Clear browser cache (Ctrl+F5)
3. Try different browser
4. Wait 2-3 minutes for GitHub Pages update

---

## 📱 Mobile Usage

### **Mobile-Friendly Features:**
- Responsive design works on all devices
- Touch-friendly ingredient input
- Swipe between tabs
- Optimized for small screens

### **Mobile Tips:**
- Use voice input for adding ingredients
- Bookmark the website for quick access
- Use landscape mode for better viewing

---

## 🎉 Success Stories

### **"I found 5 new recipes with just chicken and vegetables!"**
- User discovered Chicken Stir Fry, Chicken Parmesan, and more

### **"The substitution suggestions saved my dinner!"**
- Missing milk? Used almond milk instead

### **"Perfect for meal planning with leftovers!"**
- Used leftover ingredients to find new recipes

---

**Ready to start cooking? Visit `https://ajaybadhe850.github.io/ajays-port/` and begin your culinary adventure!** 🍽️✨
