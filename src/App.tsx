import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { WalletDetailPage } from './pages/WalletDetailPage'
import { WalletListPage } from './pages/WalletListPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WalletListPage />} />
        <Route path="/wallets/:id" element={<WalletDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
