import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import TherapyAssistant from './Pages/TherapyAssistant'

// Register the service worker so the app opens instantly and still works when
// the clinic wifi drops (the browser's own voice takes over then).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Offline support is a bonus; never block startup over it.
    })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TherapyAssistant />
    {/* Without this, every toast in the app was silently dropped. */}
    <Toaster position="top-center" richColors closeButton />
  </StrictMode>,
)
