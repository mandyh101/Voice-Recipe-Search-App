export interface Recipe {
  id: string; 
  title: string;
  ingredients: string;
  servings: string;
  instructions: string;
}

// Helper to pass the ingredients into an array:
export interface ParsedRecipe extends Omit<Recipe, 'ingredients' | 'instructions'> {
  ingredients: string[];
  rawIngredients: string[];
  instructions: string[];
}

const stripMeasurements = (ingredient: string): string => {
  // First split on semicolon and take only the first part
  const mainIngredient = ingredient.split(';')[0];
  // Remove common measurement patterns
  return mainIngredient
    // Remove quantities like "1" or "1.5" or "½" at start
    .replace(/^[\d\s\.\/]+/g, '')
    // Remove common measurements (lb, oz, cup, ts, tsp, etc.)
    .replace(/\b(lb|lbs|oz|cup|cups|c|md|lg|sm|tb|ts|tsp|teaspoon|teaspoons|tbsp|tablespoon|tablespoons|pk|pt|pint|pints|g|gram|grams|kg|ml|qt|quart|see recipe |)\b\.?\s*/gi, ' ')
    // Remove fractions like 1/2
    .replace(/\d+\/\d+\s*/g, '')
    // Remove amounts in parentheses
    .replace(/\(.*?\)/g, '')
    // Clean up any leftover commas and trim
    .replace(/^,\s*/, '')
    .trim();
};

// Helper function to parse instructions into an array of strings based on existing numbering of steps if the formatting exists in the instrcutions, otherwise break up the instrcutions into sentences.
export const parseMethod = (method: string): string[] => {
  // Check if it's a numbered list (contains patterns like "1.", "2.", etc)
  const hasNumberedSteps = /\d+\./.test(method);
  
  if (hasNumberedSteps) {
    // If numbered, split on numbers followed by periods
    return method
      .split(/\d+\./)
      .map(step => step.trim())
      .filter(Boolean);
  } else {
    // If not numbered, split on periods, but be careful with decimals
    return method
      // Split on periods followed by a space or end of string
      .split(/\.(?=\s|$)/)
      .map(step => step.trim())
      .filter(step => step.length > 0)  // Remove empty strings
      .map(step => step + '.'); // Add the period back
  }
};

// Helper function to parse ingredients string into two arrays, one with measurements (raw) and one without measurements for recipe index display
export const parseIngredients = (recipe: Recipe): ParsedRecipe => {
  const rawIngredientsList = recipe.ingredients.split('|').map(i => i.trim());
  
  return {
    ...recipe,
    rawIngredients: rawIngredientsList,
    ingredients: rawIngredientsList.map(stripMeasurements),
    instructions: parseMethod(recipe.instructions)
  };
};

