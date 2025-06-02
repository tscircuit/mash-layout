import React, { useEffect } from "react"

const TailwindDecorator = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Check if Tailwind CDN is already loaded
    const existingLink = document.querySelector('link[href*="tailwindcss"]')
    if (!existingLink) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://cdn.tailwindcss.com"
      document.head.appendChild(link)

      // Optionally, load the Tailwind config script
      const script = document.createElement("script")
      script.src = "https://cdn.tailwindcss.com"
      document.head.appendChild(script)
    }
  }, [])

  return <>{children}</>
}

export default TailwindDecorator
