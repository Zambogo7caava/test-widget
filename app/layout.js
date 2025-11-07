import ScriptLoader from './components/ScriptLoader'
import './globals.css'

export const metadata = {
  title: 'Caava Widget Test',
  description: 'Testing Caava AI Widget in Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Scripts will be loaded by ScriptLoader component */}
      </head>
      <body suppressHydrationWarning>
        {children}
        {/* Widget element - will be initialized when script loads */}
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `<ai-assistant-widget
              floating="true"
              position="bottom-right"
              button-size="medium"
              button-icon="💬"
              button-text="Chat with Alex - Customer Service Agent"
              name="Alex - Customer Service Agent"
              assistant-id="9367b4b0-1ec5-4875-b89c-93cb568316d3"
              api-url="http://caava.192.0.0.123.nip.io/akili/proj_9367b4b0/web"
              api-key="/* API key will be obtained from user session */"
              enable-file-upload="true"
              theme='{"primaryColor":"#000000","backgroundColor":"#ffffff"}'
            ></ai-assistant-widget>`,
          }}
        />
        <ScriptLoader />
      </body>
    </html>
  )
}
