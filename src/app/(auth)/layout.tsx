import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="p-4">
        <Link
          href="/"
          className="text-2xl font-bold text-indigo-600"
        >
          NextLanding
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  )
}
