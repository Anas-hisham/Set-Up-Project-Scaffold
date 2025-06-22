import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/router'
import './style.css'
import 'primeicons/primeicons.css'

const app = createApp(App)

// Global error handler for Vue errors
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err, info)
  window.myAPI.logError(`Vue Error: ${err.message}\nComponent: ${info}`)

}

// Global handler for uncaught exceptions
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
  window.myAPI.logError(`Uncaught Error: ${event.error.message}`)

})

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason)
  const reason = event.reason || 'Unknown error'
  const message = reason instanceof Error ? reason.message : String(reason)
  window.myAPI.logError(`Unhandled Rejection: ${message}`)

})

app.use(router)
app.mount('#app')
