'use client'

import { useEffect, useState } from 'react'

export default function Widget() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Ensure React is available globally
    if (typeof window === 'undefined') return
    
    if (!window.React) {
      console.error('React is not available globally. Widget requires React to be loaded.')
      return
    }
    console.log('React is available globally:', !!window.React)
    console.log('ReactDOM available:', !!window.ReactDOM)

    // Wait for the widget script to load and custom element to be defined
    let attempts = 0
    const maxAttempts = 150

    const initWidget = () => {
      if (typeof window === 'undefined' || typeof customElements === 'undefined') {
        return
      }

      if (customElements.get('ai-assistant-widget')) {
        console.log('Custom element is defined, creating widget')
        
        // Check if widget already exists
        const existingWidget = document.querySelector('ai-assistant-widget')
        if (existingWidget) {
          console.log('Widget already exists')
          return
        }
        
        // Create the widget element and append to body
        const widget = document.createElement('ai-assistant-widget')
        widget.setAttribute('floating', 'true')
        widget.setAttribute('position', 'bottom-right')
        widget.setAttribute('button-size', 'medium')
        widget.setAttribute('button-icon', '💬')
        widget.setAttribute('button-text', 'Chat with Alex - Customer Service Agent')
        widget.setAttribute('name', 'Alex - Customer Service Agent')
        widget.setAttribute('assistant-id', '12daee86-5079-44cd-8157-758e90864137')
        widget.setAttribute('api-url', 'http://caava.192.0.0.123.nip.io/akili/proj_9367b4b0/web')
        widget.setAttribute('api-key', 'pk-akv1_O_7I67V9qw9vJmr626QvbrvSz5122YLX1a3PTVitt8Q')
        widget.setAttribute('enable-file-upload', 'true')
        widget.setAttribute('theme', '{"primaryColor":"#000000","backgroundColor":"#ffffff"}')
        
        document.body.appendChild(widget)
        console.log('Widget created and appended to body')
      } else {
        attempts++
        if (attempts < maxAttempts) {
          console.log(`Waiting for custom element... attempt ${attempts}/${maxAttempts}`)
          setTimeout(initWidget, 300)
        } else {
          console.error('Custom element not defined after maximum attempts')
          console.error('This might indicate an error in the widget script. Check for errors above.')
          // Check if script is loaded
          const script = document.querySelector('script[src*="@caava-ai/widget"]')
          console.log('Widget script in DOM:', !!script)
          if (script) {
            console.log('Script src:', script.src)
          }
        }
      }
    }

    // Start initialization after a delay to ensure scripts have loaded
    setTimeout(initWidget, 1500)

    // Cleanup
    return () => {
      const widget = document.querySelector('ai-assistant-widget')
      if (widget) {
        widget.remove()
      }
    }
  }, [mounted])

  return null // This component doesn't render anything
}

