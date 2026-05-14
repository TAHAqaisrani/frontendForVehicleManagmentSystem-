import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Auth
import Login    from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

// Customer
import CustomerDashboard from './pages/customer/Dashboard.jsx';
import BookService       from './pages/customer/BookService.jsx';
import CustomerBookings  from './pages/customer/Bookings.jsx';
import TrackRepair       from './pages/customer/TrackRepair.jsx';
import ServiceHistory    from './pages/customer/ServiceHistory.jsx';
import Invoice           from './pages/customer/Invoice.jsx';

// Advisor
import AdvisorDashboard  from './pages/advisor/Dashboard.jsx';
import AdvisorJobCards   from './pages/advisor/JobCards.jsx';
import CreateJobCard     from './pages/advisor/CreateJobCard.jsx';
import JobCardDetail     from './pages/advisor/JobCardDetail.jsx';

// Technician
import TechnicianQueue   from './pages/technician/Queue.jsx';
import TechnicianJobDetail from './pages/technician/JobDetail.jsx';

// Admin
import AdminDashboard    from './pages/admin/Dashboard.jsx';
import AdminBookings     from './pages/admin/Bookings.jsx';
import AdminJobCards     from './pages/admin/JobCards.jsx';
import AdminUsers        from './pages/admin/Users.jsx';

import Landing from './pages/Landing.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer */}
          <Route path="/customer/dashboard" element={<ProtectedRoute roles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/customer/book"      element={<ProtectedRoute roles={['customer']}><BookService /></ProtectedRoute>} />
          <Route path="/customer/bookings"  element={<ProtectedRoute roles={['customer']}><CustomerBookings /></ProtectedRoute>} />
          <Route path="/customer/track/:jobCardId" element={<ProtectedRoute roles={['customer']}><TrackRepair /></ProtectedRoute>} />
          <Route path="/customer/history"   element={<ProtectedRoute roles={['customer']}><ServiceHistory /></ProtectedRoute>} />
          <Route path="/customer/invoice/:jobCardId" element={<ProtectedRoute roles={['customer']}><Invoice /></ProtectedRoute>} />

          {/* Advisor */}
          <Route path="/advisor/dashboard"         element={<ProtectedRoute roles={['advisor','admin']}><AdvisorDashboard /></ProtectedRoute>} />
          <Route path="/advisor/job-cards"          element={<ProtectedRoute roles={['advisor','admin']}><AdvisorJobCards /></ProtectedRoute>} />
          <Route path="/advisor/job-cards/new/:bookingId" element={<ProtectedRoute roles={['advisor','admin']}><CreateJobCard /></ProtectedRoute>} />
          <Route path="/advisor/job-cards/:id"      element={<ProtectedRoute roles={['advisor','admin']}><JobCardDetail /></ProtectedRoute>} />

          {/* Technician */}
          <Route path="/technician/queue"   element={<ProtectedRoute roles={['technician']}><TechnicianQueue /></ProtectedRoute>} />
          <Route path="/technician/job/:id" element={<ProtectedRoute roles={['technician']}><TechnicianJobDetail /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/bookings"  element={<ProtectedRoute roles={['admin']}><AdminBookings /></ProtectedRoute>} />
          <Route path="/admin/job-cards" element={<ProtectedRoute roles={['admin']}><AdminJobCards /></ProtectedRoute>} />
          <Route path="/admin/users"     element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
