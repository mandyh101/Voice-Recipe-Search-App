import React from 'react'
import { Button } from './ui/button'
import { Mic, MicOff, Search } from 'lucide-react'

export interface SearchBarProps {
  searchText: string
  setSearchText: (text: string) => void
  handleSearch: () => void
  isListening: boolean
  toggleListening: () => void
}

export default function SearchBar({
  searchText,
  setSearchText,
  handleSearch,
  isListening,
  toggleListening,
}: SearchBarProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }
  return (
    <div className="flex flex-col mb-4 space-y-3 sm:space-x-2 sm:items-center sm:flex-row">
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
  )
}
