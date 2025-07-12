import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { DevNavigation, AuthProvider, ProductProvider, UIProvider } from './components/App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ProductProvider>
        <UIProvider>
          <App />
          <DevNavigation />
        </UIProvider>
      </ProductProvider>
    </AuthProvider>
  </React.StrictMode>,
) 