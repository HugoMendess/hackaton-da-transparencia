import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./index.css"
import App from "./App.tsx"
import { Busca } from "@/pages/Busca"
import { Eixo } from "@/pages/Eixo"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/busca" element={<Busca />} />
        <Route path="/eixo/:slug" element={<Eixo />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
