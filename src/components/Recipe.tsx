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

interface Recipe {
  id: number
  name: string
  cuisine: string
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
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Cuisine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cuisines</SelectItem>
            {cuisines.map((cuisine, index) => (
              <SelectItem key={`cuisine-${cuisine}-${index}`} value={cuisine}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedMealType} onValueChange={setSelectedMealType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Meal Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Meal Types</SelectItem>
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
            <SelectItem value="all">All Difficulties</SelectItem>
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
          Sort by Rating: {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Cuisine: {recipe.cuisine}</p>
              <p>Meal Type: {recipe.mealType}</p>
              <p>Difficulty: {recipe.difficulty}</p>
              <p>Rating: {recipe.rating}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

