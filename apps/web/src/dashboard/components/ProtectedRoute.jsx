import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { session, bootstrapping } = useAuth();

  if (bootstrapping) {
    return <div className="k-spinner" />;
  }

  if (!session) {
    return <Navigate to="/auth/welcome" replace />;
  }

  return children;
}
