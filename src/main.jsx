import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { StudentProvider } from './context/StudentContext'
import './index.css'

// HashRouter keeps deep links (e.g. /#/courses/CSCI426) working on GitHub Pages
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <StudentProvider>
        <App />
      </StudentProvider>
    </HashRouter>
  </React.StrictMode>,
)
