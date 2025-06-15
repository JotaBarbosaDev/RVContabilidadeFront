import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import TokenExpiryNotification from './components/TokenExpiryNotification';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewDashboardPage from './pages/NewDashboardPage';
import ClientProfilePage from './pages/ClientProfilePage';

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
          
          {/* Rotas protegidas - requerem autenticação */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <NewDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard-old" 
            element={
              <ProtectedRoute>
                <DashboardPage />
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
