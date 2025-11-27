import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EcoTrack - Track Your Carbon Footprint',
  description: 'AI-powered carbon footprint tracker that helps you understand and reduce your environmental impact',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
