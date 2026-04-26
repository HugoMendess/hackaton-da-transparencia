import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./index.css"
import App from "./App.tsx"
import { Busca } from "@/pages/Busca"
import { Eixo } from "@/pages/Eixo"
import { Mapa } from "@/pages/Mapa"
import { Detalhe } from "@/pages/Detalhe"
import { Cargos } from "@/pages/Cargos"
import { Servidor } from "@/pages/Servidor"
import { Sobre } from "@/pages/Sobre"
import { ScrollToTop } from "@/components/layout/ScrollToTop"
import { AjudaInteligenteProvider } from "@/contexts/AjudaInteligenteContext"
import { DrawerAjudaInteligente } from "@/components/ia/DrawerAjudaInteligente"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AjudaInteligenteProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/busca" element={<Busca />} />
          <Route path="/eixo/:slug" element={<Eixo />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/detalhe" element={<Detalhe />} />
          <Route path="/cargos" element={<Cargos />} />
          <Route path="/servidor" element={<Servidor />} />
          <Route path="/sobre" element={<Sobre />} />
        </Routes>
        <DrawerAjudaInteligente />
      </AjudaInteligenteProvider>
    </BrowserRouter>
  </StrictMode>
)
