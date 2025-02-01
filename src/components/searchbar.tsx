import React from 'react'
import { Button } from './ui/button'
import { Mic, MicOff, Search, X } from 'lucide-react'

export interface SearchBarProps {
  searchText: string
  setSearchText: (text: string) => void
  handleSearch: () => void
  isListening: boolean
  toggleListening: () => void
  isLoading: boolean
}

export default function SearchBar({
  searchText,
  setSearchText,
  handleSearch,
  isListening,
  toggleListening,
  isLoading,
}: SearchBarProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }
  return (
    <div className="flex flex-col mb-4 space-y-3 sm:space-y-0 sm:space-x-2 sm:items-center sm:flex-row">
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
      <div className="relative flex-grow">
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Say or type your recipe search..."
        />
        {searchText && (
          <button
            onClick={() => setSearchText('')}
            className="absolute text-gray-500 -translate-y-1/2 right-2 top-1/2 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <Button onClick={handleSearch} disabled={isLoading}>
        <Search className="w-4 h-4 mr-2" />
        {isLoading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  )
}
