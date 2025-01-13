'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Mic, MicOff, Search } from 'lucide-react'
import { Recipe } from './types'
import { dummyRecipes } from './data/dummy-recipes'

// Define types for Web Speech API
interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
  onstart: () => void
  start: () => void
  stop: () => void
  abort: () => void
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export default function VoiceRecipeSearch(): JSX.Element {
  const [isListening, setIsListening] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [recipes, setRecipes] = useState<Recipe[]>(dummyRecipes)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  /**
   * Filter recipes based on the search text.
   */
  const handleSearch = useCallback((): void => {
    const searchTerms = searchText.toLowerCase().trim().split(' ')
    const filteredRecipes = dummyRecipes.filter((recipe) =>
      searchTerms.every(
        (term) =>
          recipe.title.toLowerCase().includes(term) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(term)
          )
      )
    )
    setRecipes(filteredRecipes)
    console.log('dummy', dummyRecipes)
    console.log('searchtetxt', searchText)
    console.log('filtered', filteredRecipes)
    console.log('recipes', recipes)
  }, [searchText])

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition

      // Configure recognition
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = 'en-UK'

      // Handle results
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        console.log(finalTranscript, interimTranscript)
        const currentTranscript = finalTranscript || interimTranscript
        if (currentTranscript.trim()) {
          setSearchText(currentTranscript)
          if (finalTranscript) {
            // Auto search when we have a final transcript
            handleSearch()
            recognition.stop()
          }
        }
      }

      // Handle errors
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        if (event.error === 'not-allowed') {
          alert('Please allow microphone access to use voice search')
        }
        if (event.error === 'network') {
          alert(
            'Network error occurred. Please check your internet connection or try Chrome if you are using another browser.'
          )
        }
      }

      // Handle end of speech
      recognition.onend = () => {
        setIsListening(false)
      }

      // Handle start of speech
      recognition.onstart = () => {
        setIsListening(true)
      }
    } catch (error) {
      console.error('Error initializing speech recognition:', error)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [handleSearch])

  const toggleListening = (): void => {
    if (!recognitionRef.current) {
      console.error('Speech recognition not initialized')
      return
    }

    try {
      if (isListening) {
        recognitionRef.current.stop()
      } else {
        recognitionRef.current.start()
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error)
      setIsListening(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(e.target.value)
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Voice Recipe Search</h1>
      <div className="flex items-center mb-4 space-x-2">
        <Button
          onClick={toggleListening}
          variant={isListening ? 'destructive' : 'default'}
        >
          {isListening ? (
            <MicOff className="w-4 h-4 mr-2" />
          ) : (
            <Mic className="w-4 h-4 mr-2" />
          )}
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Button>
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          className="flex-grow p-2 border rounded"
          placeholder="Say or type your recipe search..."
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardContent className="p-4">
              <h2 className="mb-2 text-xl font-semibold">{recipe.title}</h2>
              <p className="text-sm text-gray-600">
                Ingredients: {recipe.ingredients.join(', ')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
