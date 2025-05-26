import React from "react"
import { createRoot } from "react-dom/client"

const container = document.getElementById("root")
if (!container) throw new Error("Root element not found")

const root = createRoot(container)
root.render(<div>This app is made to run via react-cosmos not vite</div>)
