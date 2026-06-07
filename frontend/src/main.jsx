import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Authprovider } from './contexts/AuthContext.jsx'


createRoot(document.getElementById('root')).render(

  <StrictMode>
    <Authprovider>
      <App />
    </Authprovider>
  </StrictMode>,
)
