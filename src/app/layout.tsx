import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jagoan Sejarah',
  description: 'Jagoan Sejarah adalah permainan edukasi yang menguji pengetahuan sejarah kamu dengan cara yang menyenangkan. Tantang dirimu untuk menjawab pertanyaan-pertanyaan menarik dan raih gelar Jagoan Sejarah!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/trophy.png" type="image/png"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet"></link>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <meta name="robots" content="index, follow" />
        <meta name="description" content="Jagoan Sejarah adalah permainan edukasi yang menguji pengetahuan sejarah kamu dengan cara yang menyenangkan." />
        <link rel="canonical" href="https://jagoan-sejarah.vercel.app/" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
      </head>
      <body>{children}</body>
    </html>
  )
}