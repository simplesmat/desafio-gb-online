'use client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Recipe {
  id: number
  name: string
  cuisine: string
  image: string
  ingredients: string[]
  instructions: string[]
  mealType: string
  difficulty: string
  rating: number
}

interface RecipeDialogProps {
  recipe: Recipe | null
  onClose: () => void
}

const RecipeDialog = ({ recipe, onClose }: RecipeDialogProps) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set())

  if (!recipe) return null

  const toggleIngredient = (ingredient: string) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(ingredient)) {
      newChecked.delete(ingredient)
    } else {
      newChecked.add(ingredient)
    }
    setCheckedIngredients(newChecked)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recipe.name}</DialogTitle>
        </DialogHeader>
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-48 object-cover rounded"
        />
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Ingredientes</h3>
            <div className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={`ingredient-${index}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ingredient-${index}`}
                    checked={checkedIngredients.has(ingredient)}
                    onCheckedChange={() => toggleIngredient(ingredient)}
                  />
                  <label
                    htmlFor={`ingredient-${index}`}
                    className={`text-sm ${
                      checkedIngredients.has(ingredient) ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {ingredient}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Instruções</h3>
            <ol className="list-decimal pl-5 space-y-2">
              {recipe.instructions.map((instruction, index) => (
                <li key={`instruction-${index}`} className="text-sm">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <Button variant="outline" onClick={onClose} className="mt-4">
          Fechar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [cuisines, setCuisines] = useState<string[]>([])
  const [mealTypes, setMealTypes] = useState<string[]>([])
  const [difficulties, setDifficulties] = useState<string[]>([])
  const [selectedCuisine, setSelectedCuisine] = useState('all')
  const [selectedMealType, setSelectedMealType] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRecipe, setExpandedRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    fetchRecipes()
  }, [])

  useEffect(() => {
    filterAndSortRecipes()
  }, [recipes, selectedCuisine, selectedMealType, selectedDifficulty, sortOrder, searchTerm])

  const fetchRecipes = async () => {
    try {
      const response = await fetch('https://dummyjson.com/recipes')
      const data = await response.json()
      setRecipes(data.recipes)

      // case sensitive, normalizar antes de fazer o set

      

      const uniqueCuisines = [...new Set(data.recipes.map((recipe: Recipe) => recipe.cuisine))].sort() as string[]
      const uniqueMealTypes = [...new Set(data.recipes.map((recipe: Recipe) => recipe.mealType))].sort() as string[]
      const uniqueDifficulties = [...new Set(data.recipes.map((recipe: Recipe) => recipe.difficulty))].sort() as string[]

      setCuisines(uniqueCuisines)
      setMealTypes(uniqueMealTypes)
      setDifficulties(uniqueDifficulties)
    } catch (error) {
      console.error('Error fetching recipes:', error)
    }
  }

  const filterAndSortRecipes = () => {
    let filtered = recipes.filter((recipe) => {
      return (
        (selectedCuisine === 'all' || recipe.cuisine === selectedCuisine) &&
        (selectedMealType === 'all' || recipe.mealType === selectedMealType) &&
        (selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty) &&
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

    filtered.sort((a, b) => {
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
    })

    setFilteredRecipes(filtered)
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        <Input
          type="text"
          placeholder="Procure por nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Cozinha de origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {cuisines.map((cuisine, index) => (
              <SelectItem key={`cuisine-${cuisine}-${index}`} value={cuisine}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedMealType} onValueChange={setSelectedMealType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de refeição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {mealTypes.map((mealType, index) => (
              <SelectItem key={`mealType-${mealType}-${index}`} value={mealType}>
                {mealType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {difficulties.map((difficulty, index) => (
              <SelectItem key={`difficulty-${difficulty}-${index}`} value={difficulty}>
                {difficulty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          Ordene por classificação: {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-48 object-cover rounded"
              />
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Cozinha de origem:</strong> {recipe.cuisine}
                </p>
                <p>
                  <strong>Tipo de refeição:</strong> {recipe.mealType}
                </p>
                <p>
                  <strong>Dificuldade:</strong> {recipe.difficulty}
                </p>
                <p>
                  <strong>Classificação:</strong>{' '}
                  <span className="text-yellow-500 font-medium">{'★'.repeat(recipe.rating)}{'☆'.repeat(5 - recipe.rating)}</span>
                </p>
              </div>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setExpandedRecipe(recipe)}
              >
                Ver Instruções
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {expandedRecipe && (
        <RecipeDialog 
          recipe={expandedRecipe} 
          onClose={() => setExpandedRecipe(null)} 
        />
      )}
    </div>
  )
}