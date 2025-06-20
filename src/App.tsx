import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import TokenExpiryNotification from './components/TokenExpiryNotification';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NewDashboardPage from './pages/NewDashboardPage';
import ClientProfilePage from './pages/ClientProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRequestsPage from './pages/AdminRequestsPage';
import AdminRequestDetailsPage from './pages/AdminRequestDetailsPage';
import AdminUsersPage from './pages/AdminUsersPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <TokenExpiryNotification />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Rota pública - redireciona para dashboard se já autenticado */}
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Rota de registo - público */}
          <Route 
            path="/register" 
            element={
              <ProtectedRoute requireAuth={false}>
                <RegisterPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Rotas protegidas - requerem autenticação */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AdminProvider>
                  <NewDashboardPage />
                </AdminProvider>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard-old" 
            element={
              <ProtectedRoute>
                <AdminProvider>
                  <DashboardPage />
                </AdminProvider>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ClientProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Rotas administrativas - requerem permissões de admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminProvider>
                  <AdminDashboardPage />
                </AdminProvider>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/requests" 
            element={
              <ProtectedRoute>
                <AdminProvider>
                  <AdminRequestsPage />
                </AdminProvider>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/requests/:id" 
            element={
              <ProtectedRoute>
                <AdminProvider>
                  <AdminRequestDetailsPage />
                </AdminProvider>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute>
                <AdminProvider>
                  <AdminUsersPage />
                </AdminProvider>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
