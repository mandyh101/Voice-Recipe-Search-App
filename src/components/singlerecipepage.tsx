import { ParsedRecipe } from '../types'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

interface SingleRecipePageProps {
  recipe: ParsedRecipe
  onBack: () => void
}

export default function SingleRecipePage({
  recipe,
  onBack,
}: SingleRecipePageProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="relative flex items-start justify-start gap-10 mb-6">
          <h1 className="text-3xl font-bold text-left">{recipe.title}</h1>
          <Button
            onClick={onBack}
            variant="default"
            className="absolute top-0 right-0 flex-shrink-0"
          >
            Back to Search
          </Button>
        </div>

        <div className="mb-6 text-left">
          <h2 className="mb-2 text-xl font-semibold">Servings</h2>
          <p className="text-gray-700">{recipe.servings}</p>
        </div>

        <div className="mb-6 text-left">
          <h2 className="mb-2 text-xl font-semibold">Ingredients</h2>
          <ul className="pl-6 space-y-2 list-disc">
            {recipe.rawIngredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700">
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6 text-left">
          <h2 className="mb-2 text-xl font-semibold">Instructions</h2>
          <ol className="pl-6 space-y-2 list-decimal">
            {recipe.instructions.split('|').map((instruction, index) => (
              <li key={index} className="text-gray-700">
                {instruction.trim()}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
