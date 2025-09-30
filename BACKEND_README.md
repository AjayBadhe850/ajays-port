# FlavorGraph Backend Setup

## Installation

1. **Install Node.js dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get recipe by ID
- `POST /api/recipes` - Create new recipe (requires auth)
- `PUT /api/recipes/:id` - Update recipe (requires auth)
- `DELETE /api/recipes/:id` - Delete recipe (requires auth)
- `POST /api/recipes/search` - Search recipes by ingredients

### Ingredients
- `GET /api/ingredients` - Get all ingredients

## Database

The application uses SQLite database (`flavorgraph.db`) with the following tables:
- `users` - User accounts
- `recipes` - Recipe data
- `ingredients` - Ingredient catalog
- `recipe_ingredients` - Many-to-many relationship

## Features

- **Graph Theory**: Ingredient compatibility analysis
- **Backtracking Algorithm**: Systematic recipe exploration
- **Greedy Algorithm**: Efficient recipe suggestions
- **JWT Authentication**: Secure user sessions
- **Rate Limiting**: API protection
- **CORS Support**: Cross-origin requests
- **SQLite Database**: Lightweight data storage

## Environment Variables

- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - JWT signing secret (default: flavorgraph-secret-key-2024)

## Security Features

- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes)
- Password hashing with bcrypt
- JWT token authentication
- Input validation

## Development

The server automatically:
- Creates database tables on startup
- Inserts sample recipe data
- Serves static files from root directory
- Provides API endpoints for frontend integration
