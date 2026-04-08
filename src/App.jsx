import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { RankingDetailPage } from './pages/RankingDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ranking/:id" element={<RankingDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}