import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Swap from './components/Swap.jsx'
import Tokens from './components/Tokens.jsx'
import { Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
      <div className='App'>
        <Header />
        <div className='mainWindow'>
          <Routes>
            <Route path="/" element={<Swap />} />
            <Route path="/tokens" element={<Tokens />} />
          </Routes>
        </div>
      </div>
  )
}

export default App
