'use client'

import {useState, useEffect, use} from 'react'
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

    useEffect(() => {
        fetchRecipes()

    }, [])

    const fetchRecipes = async () => {
        try{
            const response = await fetch('https://dummyjson.com/recipes')
            const data = await response.json()
            setRecipes(data.recipes)
        } catch(error) {
            console.error('Error fetching recipes:', error)
        }
    }

    return (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
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
    