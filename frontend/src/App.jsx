import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Swap from './components/Swap.jsx'
import Tokens from './components/Tokens.jsx'
import { Route, Routes } from 'react-router-dom'
import { useConnection } from 'wagmi'

function App() {

  const { address, isConnected } = useConnection()

  const [count, setCount] = useState(0)

  return (
      <div className='App'>
        <Header isConnected={isConnected} address={address} />
        <div className='mainWindow'>
          <Routes>
            <Route path="/" element={<Swap />} isConnected={isConnected} address={address} />
            <Route path="/tokens" element={<Tokens />} />
          </Routes>
        </div>
      </div>
  )
}

export default App
