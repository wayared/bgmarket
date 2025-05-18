import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import Login from '../pages/Login';
import ClienteProductos from '../pages/ClienteProductos';
import AdminProductos from '../pages/AdminProductos';
import ClienteHome from '../pages/ClienteHome';
import AdminHome from '../pages/AdminHome';

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

      <Route path="/admin" element={
        <ProtectedRoute><AdminHome /></ProtectedRoute>
      } />

      <Route path="/productos" element={
        <ProtectedRoute><ClienteProductos /></ProtectedRoute>
      } />

      <Route path="/admin/productos" element={
        <ProtectedRoute><AdminProductos /></ProtectedRoute>
      } />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
