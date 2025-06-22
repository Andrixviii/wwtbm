import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Who Wants to Be a Millionaire',
  description: 'Test your knowledge and win virtual millions in this classic game show experience!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/trophy.svg" type="image/svg+xml"/>
      </head>
      <body>{children}</body>
    </html>
  )
}