import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import ManageUsers from '../pages/ManageUsers';
import Login from '../pages/Login';
import ClienteProductos from '../pages/ClienteProductos';
import ClienteHome from '../pages/ClienteHome';
import AdminDashboard from '../pages/AdminDashboard';
// import ManageUsers from '../pages/ManageUsers';

const ProtectedRoute = ({ children }) => {
  const { usuario } = useContext(AuthContext);
  return usuario ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas por rol */}
      <Route path="/cliente" element={
        <ProtectedRoute><ClienteHome /></ProtectedRoute>
      } />

      <Route path="/productos" element={
        <ProtectedRoute><ClienteProductos /></ProtectedRoute>
      } />

      {/* Admin Dashboard */}
      <Route path="/admin-dashboard" element={
        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
      } />

      {/* Opcional: redireccionar /admin a dashboard */}
      <Route path="/admin" element={<Navigate to="/admin-dashboard" />} />

      <Route path="/admin/usuarios" element={
        <ProtectedRoute><ManageUsers /></ProtectedRoute>
      } />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
