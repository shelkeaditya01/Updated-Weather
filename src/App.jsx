import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Weather from './components/Weather'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Weather />
      </main>
      <Footer />
    </div>
  )
}

export default App
