import './globals.css'
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const metadata = {
  title: 'Life Fuel - Auth',
  description: 'Register or sign in to Life Fuel',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="gradient-bg min-h-screen">
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </body>
    </html>
  )
}
