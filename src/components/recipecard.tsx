import { Card, CardContent } from '../components/ui/card'

interface RecipeCardProps {
  id: string
  title: string
  ingredients: string[]
}

export default function RecipeCard({ recipe }: { recipe: RecipeCardProps }) {
  return (
    <Card key={recipe.id}>
      <CardContent className="p-4">
        <h2 className="mb-2 text-xl font-semibold">{recipe.title}</h2>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Ingredients:</span>{' '}
          {recipe.ingredients.join(', ')}
        </p>
      </CardContent>
    </Card>
  )
}
