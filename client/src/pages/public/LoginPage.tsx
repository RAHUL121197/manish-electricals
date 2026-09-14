import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, UserRound } from 'lucide-react';
import SEO from '../../components/SEO';
import Logo from '../../components/Logo';
import { useAuth } from '../../auth/AuthContext';
import { ApiError } from '../../lib/api';
import { useT } from '../../i18n/LanguageContext';

type Role = 'admin' | 'employee';

export default function LoginPage() {
  const t = useT();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState<Role>('employee');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ loginId?: string; password?: string; form?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const redirectTarget = (location.state as { from?: string } | null)?.from;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: { loginId?: string; password?: string } = {};
    if (!loginId.trim()) next.loginId = t('login.invalidId');
    if (!password) next.password = t('login.invalidPassword');
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setErrors((prev) => ({ ...prev, form: undefined }));
    try {
      const user = await login(loginId.trim(), password);
      const destination = redirectTarget || (user.role === 'admin' ? '/admin' : '/employee');
      navigate(destination, { replace: true });
    } catch (err) {
      setErrors({
        form: err instanceof ApiError ? err.message : t('common.somethingWentWrong'),
      });
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Login | MANISH ELECTRICALS Management System"
        description="Secure login for the MANISH ELECTRICALS management system — Admin and Employee portals."
      />
      <div className="login-page">
        <div className="login-card" style={{ width: 'min(460px, 100%)' }}>
          <div className="login-head">
            <div className="logo-slot">
              <Logo size={84} />
            </div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>{t('login.heading')}</h1>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>
              {t('login.sub')}
            </p>
          </div>

          <div className="login-role-tabs" role="tablist" aria-label="Login role">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'employee'}
              className={`role-tab${role === 'employee' ? ' active' : ''}`}
              onClick={() => setRole('employee')}
            >
              {t('login.employee')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'admin'}
              className={`role-tab${role === 'admin' ? ' active' : ''}`}
              onClick={() => setRole('admin')}
            >
              {t('login.admin')}
            </button>
          </div>

          <form className="login-body" onSubmit={handleSubmit} noValidate>
            {errors.form && (
              <div className="alert alert-error" role="alert">
                {errors.form}
              </div>
            )}

            <div className="form-field">
              <label htmlFor="login-id">{t('login.loginId')}</label>
              <input
                id="login-id"
                className="input"
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder={role === 'employee' ? t('login.loginIdPhEmp') : t('login.loginIdPhAdmin')}
                autoComplete="username"
                autoCapitalize="characters"
                aria-invalid={Boolean(errors.loginId)}
              />
              {errors.loginId && <span className="field-error" role="alert">{errors.loginId}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="login-password">{t('login.password')}</label>
              <input
                id="login-password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.passwordPh')}
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password && <span className="field-error" role="alert">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
              style={{ width: '100%', marginTop: 8 }}
            >
              {submitting ? (
                <>
                  <span className="spinner" aria-hidden="true" /> {t('login.signingIn')}
                </>
              ) : (
                <>
                  <Lock aria-hidden="true" size={17} /> {t('login.signIn')}
                </>
              )}
            </button>
          </form>

          <div className="login-foot">
            <p style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.82rem' }}>
              <ShieldCheck aria-hidden="true" size={15} style={{ color: 'var(--c-accent)' }} />
              {t('login.secureNote')}
            </p>
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.82rem' }}>
              <UserRound aria-hidden="true" size={15} />
              {t('login.helpNote')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}