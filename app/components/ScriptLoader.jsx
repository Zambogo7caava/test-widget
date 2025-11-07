'use client'

import { useEffect } from 'react'

export default function ScriptLoader() {
  useEffect(() => {
    // Set up global error handler to catch widget script errors
    const errorHandler = (event) => {
      if (event.message && (event.message.includes('__SECRET_INTERNALS') || event.message.includes('widget'))) {
        console.error('Widget script error detected:', event.message, event.filename, event.lineno)
      }
    }
    window.addEventListener('error', errorHandler)
    
    // Also catch unhandled promise rejections
    const rejectionHandler = (event) => {
      if (event.reason && event.reason.toString().includes('widget')) {
        console.error('Unhandled promise rejection in widget:', event.reason)
      }
    }
    window.addEventListener('unhandledrejection', rejectionHandler)

    // Load scripts in the correct order
    const loadScript = (src, crossOrigin = false) => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        const existing = document.querySelector(`script[src="${src}"]`)
        if (existing) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.src = src
        if (crossOrigin) {
          script.crossOrigin = 'anonymous'
        }
        script.onload = () => {
          console.log(`Script loaded successfully: ${src}`)
          resolve()
        }
        script.onerror = (error) => {
          console.error(`Failed to load script: ${src}`, error)
          reject(new Error(`Failed to load script: ${src}`))
        }
        document.head.appendChild(script)
      })
    }

    const initWidget = async () => {
      try {
        // Store reference to Next.js React (if it exists) to restore later
        const nextJsReact = window.React
        const nextJsReactDOM = window.ReactDOM
        
        // Load React first from CDN
        await loadScript('https://unpkg.com/react@18/umd/react.production.min.js', true)
        console.log('CDN React loaded')
        
        // Ensure CDN React is set on window
        if (!window.React) {
          console.error('CDN React is not available globally after loading')
          return
        }
        
        // Store CDN React references
        const cdnReact = window.React
        const cdnReactVersion = window.React?.version
        console.log('CDN React available:', !!cdnReact, 'Version:', cdnReactVersion)
        
        // Load ReactDOM second from CDN
        await loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', true)
        console.log('CDN ReactDOM loaded')
        
        // Ensure ReactDOM is using the CDN React
        if (!window.ReactDOM) {
          console.error('CDN ReactDOM is not available globally after loading')
          return
        }
        
        // Force ReactDOM to use CDN React
        // This ensures the widget script will use the CDN React
        window.React = cdnReact
        window.ReactDOM = window.ReactDOM
        
        console.log('React is available globally:', !!window.React)
        console.log('ReactDOM is available globally:', !!window.ReactDOM)
        
        // Wait a bit for React to fully initialize
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Before loading widget script, ensure CDN React is the only React available
        // Store Next.js React references temporarily
        const _nextReact = window.__NEXT_DATA__?.react
        delete window.__NEXT_DATA__?.react
        
        // Ensure CDN React is definitely on window
        if (window.React !== cdnReact) {
          console.warn('React was overwritten, restoring CDN React')
          window.React = cdnReact
        }
        
        console.log('React before widget load:', {
          isCDNReact: window.React === cdnReact,
          hasVersion: !!window.React?.version,
          version: window.React?.version
        })
        
        // Load widget script with error handling
        try {
          // Create script element manually to have more control
          const widgetScript = document.createElement('script')
          widgetScript.src = 'https://unpkg.com/@caava-ai/widget@0.1.2/dist/widget.full.js.umd.js'
          widgetScript.type = 'text/javascript'
          
          await new Promise((resolve, reject) => {
            widgetScript.onload = () => {
              console.log('Widget script loaded')
              resolve()
            }
            widgetScript.onerror = (error) => {
              console.error('Error loading widget script:', error)
              reject(error)
            }
            document.head.appendChild(widgetScript)
          })
        } catch (error) {
          console.error('Error loading widget script:', error)
          return
        }
        
        // Wait a bit longer for the script to execute and register the custom element
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Check if there were any errors during script execution
        console.log('After widget script load, checking React availability:', {
          hasReact: !!window.React,
          hasReactDOM: !!window.ReactDOM,
          reactType: typeof window.React,
          isStillCDNReact: window.React === cdnReact,
        })
        
        // Check for any errors in the widget script
        console.log('Checking for custom element...')
        console.log('Available custom elements:', Array.from(customElements.keys || []))
        
        // Widget element is already in the HTML, just wait for custom element to be defined
        // The widget should auto-initialize when the custom element is registered
        let attempts = 0
        const maxAttempts = 100
        
        const checkWidget = () => {
          if (customElements.get('ai-assistant-widget')) {
            console.log('Custom element is defined!')
            
            const existingWidget = document.querySelector('ai-assistant-widget')
            if (existingWidget) {
              console.log('Widget element found in DOM:', existingWidget)
              console.log('Widget should be visible now')
              return
            } else {
              console.warn('Custom element is defined but widget element not found in DOM')
            }
          } else {
            attempts++
            if (attempts < maxAttempts) {
              if (attempts % 10 === 0) {
                console.log(`Waiting for custom element... attempt ${attempts}/${maxAttempts}`)
              }
              setTimeout(checkWidget, 300)
            } else {
              console.error('Custom element not defined after maximum attempts')
              console.error('This suggests the widget script failed to register the custom element')
              console.error('Check the console above for any script errors')
              // Check if widget element exists
              const widgetEl = document.querySelector('ai-assistant-widget')
              console.log('Widget element in DOM:', !!widgetEl)
              if (widgetEl) {
                console.log('Widget element exists but custom element not registered')
              }
            }
          }
        }
        
        checkWidget()
      } catch (error) {
        console.error('Error loading scripts:', error)
      }
    }

    initWidget()

    // Cleanup
    return () => {
      window.removeEventListener('error', errorHandler)
      window.removeEventListener('unhandledrejection', rejectionHandler)
    }
  }, [])

  return null
}

