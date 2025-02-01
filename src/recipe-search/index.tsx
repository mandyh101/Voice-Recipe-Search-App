'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import SingleRecipePage from '../components/singlerecipepage'
import { ParsedRecipe } from '../types'
import { searchRecipes } from '../services/api/recipeservice'
import SearchBar from '../components/searchbar'
import RecipeCard from '../components/recipecard'
import { MessageSquareWarning } from 'lucide-react'

// Types for Web Speech API
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
  const [recipes, setRecipes] = useState<ParsedRecipe[]>()
  const [selectedRecipe, setSelectedRecipe] = useState<ParsedRecipe | null>(
    null
  )
  const [isLoading, setIsLoading] = useState<boolean>(false) //todo add loading state
  const [error, setError] = useState<string | null>(null) //todo add error state
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [tryAgainMessage, setTryAgainMessage] = useState<string>('')

  /**
   * Search recipes using the API.
   */
  const handleSearch = useCallback(async (): Promise<void> => {
    // reset try again message when user searches again
    if (tryAgainMessage) {
      setTryAgainMessage('')
    }

    if (!searchText.trim()) {
      setRecipes([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await searchRecipes(searchText)
      console.log('data', data)
      if (data.length === 0) {
        setTryAgainMessage('No recipes found. Please try again.')
      }
      setRecipes(data)
    } catch (err) {
      console.error('Error fetching recipes:', err)
      setError('Failed to fetch recipes. Please try again.')
      setRecipes([])
    } finally {
      setIsLoading(false)
    }
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
          console.log(
            'Update the search text after voice input',
            currentTranscript,
            finalTranscript
          )
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

  const renderContent = () => {
    if (error) {
      return (
        <div className="p-8 text-center text-red-600">
          An error occurred while searching for recipes. Please try again.
        </div>
      )
    }

    if (tryAgainMessage) {
      return (
        <div className="p-8 text-center text-gray-600">
          No recipes found for your search. Please try another ingredient.
        </div>
      )
    }

    return (
      <div>
        {selectedRecipe ? (
          <SingleRecipePage
            recipe={selectedRecipe}
            onBack={() => setSelectedRecipe(null)}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recipes &&
              recipes.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={recipe}
                  onSelect={() => setSelectedRecipe(recipe)}
                />
              ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Voice Recipe Search</h1>
      <p className="mb-4">
        Speak or type in your recipe search to discover new and creative recipes
        - Happy Cooking!
      </p>
      {/* TODO hide below if browser is chrome or safari! */}
      <p className="p-2 mb-4 text-sm bg-red-100 border-red-200">
        {/* add a warning icon */}
        <MessageSquareWarning className="inline mr-2" />
        <span>
          Please note, you must be using Chrome or Safari to use the speech
          functionality.
        </span>
      </p>
      {selectedRecipe ? (
        <SingleRecipePage
          recipe={selectedRecipe}
          onBack={() => setSelectedRecipe(null)}
        />
      ) : (
        <>
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearch={handleSearch}
            isListening={isListening}
            toggleListening={toggleListening}
            isLoading={isLoading}
          />
          {renderContent()}
        </>
      )}
    </div>
  )
}
