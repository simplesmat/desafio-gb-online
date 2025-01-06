'use client'

import {useState, useEffect, use} from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
    const [selectedCuisine, setSelectedCuisine] = useState('all')

    useEffect(() => {
        fetchRecipes()

    }, [])

    useEffect(() => {
      filterByCuisine()
    }, [recipes, selectedCuisine])

  
    const fetchRecipes = async () => {
        try{
            const response = await fetch('https://dummyjson.com/recipes')
            const data = await response.json()
            setRecipes(data.recipes)
            setCuisines(Array.from(new Set(data.recipes.map((recipe: Recipe) => recipe.cuisine))))
        } catch(error) {
            console.error('Error fetching recipes:', error)
        }
    }

    const filterByCuisine = () => {
      if (selectedCuisine === 'all') {
        setFilteredRecipes(recipes)
      } else {
        setFilteredRecipes(recipes.filter((recipe) => recipe.cuisine === selectedCuisine))
      }
    }

    return (
        <div>
          <div className="mb-4">
            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}> 
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {cuisines.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
    