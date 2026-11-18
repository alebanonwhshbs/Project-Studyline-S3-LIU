import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Grades from './pages/Grades'
import Timetable from './pages/Timetable'
import Features from './pages/Features'
import About from './pages/About'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:code" element={<CourseDetail />} />
        <Route path="grades" element={<Grades />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="features" element={<Features />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
