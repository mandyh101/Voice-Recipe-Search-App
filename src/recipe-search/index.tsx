'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Mic, MicOff, Search } from 'lucide-react'
import { ParsedRecipe } from '../types'
import { searchRecipes } from '../services/api/recipeservice'
import SearchBar from '../components/searchbar'

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
  const [isLoading, setIsLoading] = useState<boolean>(false) //todo add loading state
  const [error, setError] = useState<string | null>(null) //todo add error state
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  /**
   * Search recipes using the API.
   */
  const handleSearch = useCallback(async (): Promise<void> => {
    if (!searchText.trim()) {
      setRecipes([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await searchRecipes(searchText)
      console.log('data', data)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(
      'also update the search text when input changes - and this is updating to the last input instead of the current and overriding current voice inputs',
      e.target.value
    )
    console.log('rec', recognitionRef)
    setSearchText(e.target.value)
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Voice Recipe Search</h1>
      <p className="mb-4">
        Speak or type in your recipe search to discover new recipes! Please
        note, you must be using Chrome or Safari to use the speech
        functionality. Happy Cooking!
      </p>
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
        isListening={isListening}
        toggleListening={toggleListening}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recipes &&
          recipes.map((recipe) => (
            <Card key={recipe.id}>
              <CardContent className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{recipe.title}</h2>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Ingredients:</span>{' '}
                  {recipe.ingredients.join(', ')}
                </p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
