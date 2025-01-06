'use client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  instructions: string[]
  mealType: string
  difficulty: string
  rating: number
}

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

      // erro está que n to gerando um set talvez?
      // dar sort e remover duplicatas maybe

      setCuisines(Array.from(new Set(data.recipes.map((recipe: Recipe) => recipe.cuisine))))
      setMealTypes(Array.from(new Set(data.recipes.map((recipe: Recipe) => recipe.mealType))))
      setDifficulties(Array.from(new Set(data.recipes.map((recipe: Recipe) => recipe.difficulty))))
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
              <p>Cozinha de origem: {recipe.cuisine}</p>
              <p>Tipo de refeição: {recipe.mealType}</p>
              <p>Dificuldade: {recipe.difficulty}</p>
              <p>Classificação: {recipe.rating}</p>
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
        <Dialog open={!!expandedRecipe} onOpenChange={() => setExpandedRecipe(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{expandedRecipe.name}</DialogTitle>
            </DialogHeader>
            <img
              src={expandedRecipe.image}
              alt={expandedRecipe.name}
              className="w-full h-48 object-cover rounded"
            />
            <ul className="mt-2 list-disc pl-5">
              {expandedRecipe.instructions.map((instruction, index) => (
                <li key={`instruction-${expandedRecipe.id}-${index}`}>{instruction}</li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setExpandedRecipe(null)}
            >
              Fechar
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
