import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#1a1e38',
          color: '#fff',
          border: '1px solid rgba(124,106,247,0.3)',
          borderRadius: '12px',
          fontSize: '0.875rem',
        },
        success: { iconTheme: { primary: '#48bb78', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#f56565', secondary: '#fff' } },
      }}
    />
  </StrictMode>,
)
