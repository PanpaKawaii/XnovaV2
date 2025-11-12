import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext/AuthContext';
import LoadingAnimation from './LoadingAnimation/LoadingAnimation';

export default function RoleRoute({ allowedRoles, children, redirectTo = "/" }) {
  const { user, isLoading } = useAuth();
  console.log('RoleRoute user:', user, 'isLoading:', isLoading);
  
  // Hiển thị loading khi đang kiểm tra user
  if (isLoading) return <LoadingAnimation />
  
  // Nếu chưa đăng nhập, redirect về trang chủ
  if (!user) {
    return <Navigate to="/" replace state={{ unauthorized: true }} />;
  }
  
  // Nếu không đúng role
  if (!allowedRoles.includes(user.role)) {
    // Đối với owner/admin truy cập user routes, redirect về owner dashboard
    if (user.role === 'Owner' || user.role === 'Admin') {
      return <Navigate to="/owner/dashboard" replace state={{ unauthorized: true }} />;
    }
    // Đối với user khác, redirect về trang chủ
    return <Navigate to={redirectTo} replace state={{ unauthorized: true }} />;
  }
  
  return children;
} 