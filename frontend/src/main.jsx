import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import TherapyAssistant from './Pages/TherapyAssistant'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TherapyAssistant />
    <Toaster position="top-center" richColors closeButton />
  </StrictMode>,
) 
