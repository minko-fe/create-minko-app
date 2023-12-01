import { createContainer } from 'context-state'
import { useState } from 'react'

const useGlobalContext = () => {
  const [globalState, setGlobalState] = useState(1)

  return {
    globalState,
    setGlobalState,
  }
}

const GlobalContext = createContainer(useGlobalContext)

export default GlobalContext
