export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: number
  id: string
  isLoading?: boolean
}   