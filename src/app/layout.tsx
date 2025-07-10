import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Who Wants to Be a HISTORY MASTER?',
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
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet"></link>
      </head>
      <body>{children}</body>
    </html>
  )
}