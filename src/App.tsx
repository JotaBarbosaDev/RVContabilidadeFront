import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { ToastProvider } from './components/ui/toast';
import ProtectedRoute from './components/ProtectedRoute';
import TokenExpiryNotification from './components/TokenExpiryNotification';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CompleteRegisterFormPage from './pages/CompleteRegisterFormPage';
import DashboardPage from './pages/DashboardPage';
import NewDashboardPage from './pages/NewDashboardPage';
import ClientProfilePage from './pages/ClientProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRequestsPage from './pages/AdminRequestsPage';
import AdminRequestDetailsPage from './pages/AdminRequestDetailsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AccountantClientsPage from './pages/AccountantClientsPage';

function App() {
  return (
    <ToastProvider>
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
          
          {/* Rota de registo completo - público */}
          <Route 
            path="/register" 
            element={
              <ProtectedRoute requireAuth={false}>
                <CompleteRegisterFormPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Rota de registo completo com todos os campos - público */}
          <Route 
            path="/register-full" 
            element={
              <ProtectedRoute requireAuth={false}>
                <CompleteRegisterFormPage />
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
          
          {/* Rota de gestão de clientes para contabilistas */}
          <Route 
            path="/accountant/clients" 
            element={
              <ProtectedRoute>
                <AccountantClientsPage />
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
    </ToastProvider>
  );
}

export default App;
