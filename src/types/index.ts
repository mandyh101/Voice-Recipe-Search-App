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
}

// Helper function to parse ingredients string into array
export const parseIngredients = (recipe: Recipe): ParsedRecipe => {
  const ingredientsList = recipe.ingredients.split('|').map(i => i.trim());
  
  return {
    ...recipe,
    ingredients: ingredientsList
  };
};