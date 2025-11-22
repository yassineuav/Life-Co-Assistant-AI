import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="card max-w-lg text-center">
        <p className="text-sm uppercase tracking-wide text-primary font-semibold mb-3">Life Fuel</p>
        <h1 className="text-3xl font-bold mb-4">Healthy meals powered by AI</h1>
        <p className="text-slate-600 mb-8">Start by creating an account or signing in to unlock personalized recipes and smart shopping lists.</p>
        <div className="space-y-3">
          <Link href="/register" className="block">
            <button className="primary">Create account</button>
          </Link>
          <Link href="/login" className="block">
            <button className="secondary">Sign in</button>
          </Link>
        </div>
      </div>
    </main>
  )
}
