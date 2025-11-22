import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Luxivie Clean Beauty Landing Page',
  description: 'Discover clean, natural beauty products with Luxivie',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

