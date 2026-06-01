import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "RAF Chatbot - Video Comparison AI",
  description: "Compare YouTube and Instagram videos using AI-powered RAG",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
