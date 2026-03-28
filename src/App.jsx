import { Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import DashboardPage from './pages/DashboardPage'
import HotspotsPage from './pages/HotspotsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="hotspots" element={<HotspotsPage />} />
      </Route>
    </Routes>
  )
}
