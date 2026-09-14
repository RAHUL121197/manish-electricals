import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function FullPageLoader() {
  return (
    <div className="portal-loader">
      <span className="spinner" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/** Requires an authenticated session. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

/** Admin-only route — employees are redirected to their own portal. */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAdmin, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <FullPageLoader />;
  if (!isAdmin) return <Navigate to="/employee" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

/** Employee-only route — admins are redirected to their own dashboard. */
export function EmployeeRoute({ children }: { children: ReactNode }) {
  const { isEmployee, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <FullPageLoader />;
  if (!isEmployee) return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

/** For public pages (e.g. /login): send already-authenticated users to their portal. */
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  if (!ready) return <FullPageLoader />;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/employee'} replace />;
  return <>{children}</>;
}