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
        <div className="relative flex flex-col gap-10 mb-6 sm:items-start sm:justify-start">
          <h1 className="mt-16 text-3xl font-bold text-left sm:mt-0 text-wrap sm:max-w-[75%] md:max-w-[80%]">
            {recipe.title}
          </h1>
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
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="text-gray-700">
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
