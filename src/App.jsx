import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { PublicRankingPage } from './pages/PublicRankingPage'
import { RankingDetailPage } from './pages/RankingDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/r/:id" element={<PublicRankingPage />} />
        <Route path="/ranking/:id" element={<RankingDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}