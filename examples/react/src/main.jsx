import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  BrowserRouter,
  useRoutes,
} from "react-router-dom";
import Routes from 'unplugin-fs-router/routes'
import { StrictMode } from 'react';
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {useRoutes(Routes)}
    </Suspense>
  )
}

const app = createRoot(document.getElementById('root'))

app.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
