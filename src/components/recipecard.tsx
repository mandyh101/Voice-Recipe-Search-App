import { Card, CardContent } from '../components/ui/card'
import { Button } from './ui/button'

interface RecipeCardProps {
  id: string
  title: string
  ingredients: string[]
}

export default function RecipeCard({
  recipe,
  onSelect,
}: {
  recipe: RecipeCardProps
  onSelect: () => void
}) {
  return (
    <Card key={recipe.id}>
      <CardContent className="flex flex-col items-start h-full p-4">
        <h2 className="mb-2 text-xl font-semibold text-left">{recipe.title}</h2>
        <p className="mb-4 text-sm text-left text-gray-600">
          <span className="font-semibold">Ingredients:</span>{' '}
          {recipe.ingredients.join(', ')}
        </p>
        <Button
          className="mt-auto"
          variant={'outline'}
          size={'sm'}
          onClick={onSelect}
        >
          View recipe
        </Button>
      </CardContent>
    </Card>
  )
}
