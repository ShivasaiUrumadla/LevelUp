import Dashboard from "@/pages/Dashboard"
import React from 'react'
import {BrowserRouter} from "react-router-dom"
import Approutes from "@/routes/AppRoutes"

function App() {
  return (
    <BrowserRouter>
      <Approutes/>
    </BrowserRouter>
  )
}

export default App