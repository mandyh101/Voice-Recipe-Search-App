export interface Recipe {
  id: string; 
  title: string;
  ingredients: string;
  servings: string;
  instructions: string;
}

// Helper to pass the ingredients into an array:
export interface ParsedRecipe extends Omit<Recipe, 'ingredients'> {
  ingredients: string[];
  rawIngredients: string[];
}

const stripMeasurements = (ingredient: string): string => {
  // First split on semicolon and take only the first part
  const mainIngredient = ingredient.split(';')[0];
  // Remove common measurement patterns
  return mainIngredient
    // Remove quantities like "1" or "1.5" or "½" at start
    .replace(/^[\d\s\.\/]+/g, '')
    // Remove common measurements (lb, oz, cup, ts, tsp, etc.)
    .replace(/\b(lb|lbs|oz|cup|cups|c|md|lg|sm|tb|ts|tsp|teaspoon|teaspoons|tbsp|tablespoon|tablespoons|pt|pint|pints|g|gram|grams|kg|ml|qt|quart|see recipe |)\b\.?\s*/gi, ' ')
    // Remove fractions like 1/2
    .replace(/\d+\/\d+\s*/g, '')
    // Remove amounts in parentheses
    .replace(/\(.*?\)/g, '')
    // Clean up any leftover commas and trim
    .replace(/^,\s*/, '')
    .trim();
};

// Helper function to parse ingredients string into array
// export const parseIngredients = (recipe: Recipe): ParsedRecipe => {
//   const ingredientsList = recipe.ingredients.split('|').map(i => i.trim());
  
//   return {
//     ...recipe,
//     ingredients: ingredientsList
//   };
// };

export const parseIngredients = (recipe: Recipe): ParsedRecipe => {
  const rawIngredientsList = recipe.ingredients.split('|').map(i => i.trim());
  
  return {
    ...recipe,
    rawIngredients: rawIngredientsList,
    ingredients: rawIngredientsList.map(stripMeasurements)
  };
};