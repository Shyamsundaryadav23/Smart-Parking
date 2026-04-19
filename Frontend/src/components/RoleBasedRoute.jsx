import { Navigate } from "react-router-dom";

/**
 * Route protector that ensures only users with specific roles can access
 * Prevents admins from accessing user routes and vice versa
 */
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // Redirect to login if no token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check user role
  if (allowedRoles && allowedRoles.length > 0) {
    let userRole = 'user'; // default role

    // Try to get role from stored user object
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userRole = user?.role?.toLowerCase() || 'user';
      } catch (e) {
        console.error('Failed to parse user object:', e);
      }
    } else {
      // Fallback: extract role from JWT token
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userRole = payload.role?.toLowerCase() || 'user';
      } catch (e) {
        console.error('Failed to extract role from token:', e);
      }
    }

    // Check if user role is in allowed roles
    if (!allowedRoles.includes(userRole)) {
      // Redirect admin to admin dashboard if they try to access user routes
      if (userRole === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      }
      // Redirect user to user dashboard if they try to access admin routes
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default RoleBasedRoute;
