import axios from 'axios';
import { Recipe,  ParsedRecipe, parseIngredients  } from '../../types';

const API_KEY = import.meta.env.VITE_RECIPE_API;

export const searchRecipes = async (query: string): Promise<ParsedRecipe[]> => {
  try {
    const response = await axios.get<Recipe[]>(`https://api.api-ninjas.com/v1/recipe?query=${query}`, {
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
      }
    });

    // Parse the ingredients for each recipe
    return response.data.map(parseIngredients);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};
