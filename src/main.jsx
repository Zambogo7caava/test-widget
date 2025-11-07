import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Make React available globally for the widget (if not already from CDN)
if (typeof window !== 'undefined' && !window.React) {
  window.React = React
  window.ReactDOM = ReactDOM
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

