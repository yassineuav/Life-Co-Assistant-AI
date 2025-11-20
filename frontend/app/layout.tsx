import './globals.css'
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <QueryClientProvider client={queryClient}>
          <main className="max-w-5xl mx-auto p-6 space-y-6">
            <header className="flex items-center justify-between">
              <div className="font-semibold text-xl">Life Fuel</div>
              <nav className="space-x-4 text-sm">
                <a href="/dashboard">Dashboard</a>
                <a href="/fridge">Fridge</a>
                <a href="/meals/suggest">Suggest Meals</a>
                <a href="/meals/plan">Meal Plan</a>
                <a href="/shopping-list">Shopping List</a>
              </nav>
            </header>
            {children}
          </main>
        </QueryClientProvider>
      </body>
    </html>
  )
}
