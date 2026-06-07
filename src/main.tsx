import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const isTossWebView = /TOSS|AIT/i.test(navigator.userAgent)

async function main() {
  const root = createRoot(document.getElementById('root')!)

  if (isTossWebView) {
    const { GlobalConfigProvider } = await import('@apps-in-toss/web-framework')
    root.render(
      <StrictMode>
        <GlobalConfigProvider>
          <App />
        </GlobalConfigProvider>
      </StrictMode>
    )
  } else {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  }
}

main()
