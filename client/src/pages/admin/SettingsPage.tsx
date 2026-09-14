import { useState } from 'react';
import type { FormEvent } from 'react';
import { Building2, Database, KeyRound, Mail, MessageCircle, Phone, Save } from 'lucide-react';
import SEO from '../../components/SEO';
import { api, ApiError } from '../../lib/api';
import { useAuth } from '../../auth/AuthContext';
import { useT } from '../../i18n/LanguageContext';
import { COMPANY } from '../../lib/company';

export default function AdminSettingsPage() {
  const t = useT();
  const { user, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!currentPassword) next.currentPassword = t('portal.required');
    if (newPassword.length < 6) next.newPassword = t('portal.passwordMin');
    if (confirmPassword !== newPassword) next.confirmPassword = t('portal.passwordMismatch');
    if (currentPassword && newPassword && currentPassword === newPassword) {
      next.newPassword = t('portal.passwordSame');
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus('saving');
    try {
      await api.post('/api/auth/change-password', { currentPassword, newPassword });
      setStatus('success');
      setMessage(t('portal.passwordChanged'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof ApiError ? err.message : t('common.somethingWentWrong'));
    }
  };

  return (
    <>
      <SEO title="Settings | MANISH ELECTRICALS Admin" />
      <div className="portal-page">
        <header className="portal-page-head">
          <div>
            <span className="eyebrow">{t('portal.adminPortal')}</span>
            <h1>{t('portal.settings')}</h1>
          </div>
        </header>

        <div className="settings-grid">
          <section className="card settings-panel">
            <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Building2 aria-hidden="true" size={20} style={{ color: 'var(--c-accent)' }} />
              {t('settings.companySettings')}
            </h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: -6 }}>
              {t('settings.companyNote')}
            </p>

            <div className="settings-field">
              <span className="settings-label">{t('settings.companyName')}</span>
              <span className="settings-value">{COMPANY.name}</span>
            </div>
            <div className="settings-field">
              <span className="settings-label">{t('contact.phone')}</span>
              <span className="settings-value">
                <Phone aria-hidden="true" size={14} /> {COMPANY.phoneDisplay}
              </span>
            </div>
            <div className="settings-field">
              <span className="settings-label">{t('contact.whatsapp')}</span>
              <span className="settings-value">
                <MessageCircle aria-hidden="true" size={14} /> {COMPANY.phoneDisplay}
              </span>
            </div>
            <div className="settings-field">
              <span className="settings-label">{t('contact.email')}</span>
              <span className="settings-value">
                <Mail aria-hidden="true" size={14} /> {COMPANY.email}
              </span>
            </div>
            <div className="settings-field">
              <span className="settings-label">{t('contact.address')}</span>
              <span className="settings-value">{COMPANY.address}</span>
            </div>
            <div className="settings-field">
              <span className="settings-label">{t('settings.language')}</span>
              <span className="settings-value">{t('settings.languageNote')}</span>
            </div>

            <div className="alert alert-success" role="note" style={{ marginTop: 8 }}>
              <Database aria-hidden="true" size={16} />
              {t('settings.persistNote')}
            </div>
          </section>

          <section className="card settings-panel">
            <form onSubmit={handleChangePassword} noValidate>
              <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                <KeyRound aria-hidden="true" size={20} style={{ color: 'var(--c-accent)' }} />
                {t('portal.changePassword')}
              </h2>

              {status === 'success' && (
                <div className="alert alert-success" role="status">
                  {message}
                </div>
              )}
              {status === 'error' && (
                <div className="alert alert-error" role="alert">
                  {message}
                </div>
              )}

              <div className="form-field">
                <label htmlFor="current-password">{t('portal.currentPassword')}</label>
                <input
                  id="current-password"
                  className="input"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.currentPassword)}
                />
                {errors.currentPassword && <span className="field-error" role="alert">{errors.currentPassword}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="new-password">{t('portal.newPassword')}</label>
                <input
                  id="new-password"
                  className="input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.newPassword)}
                />
                {errors.newPassword && <span className="field-error" role="alert">{errors.newPassword}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="confirm-password">{t('portal.confirmPassword')}</label>
                <input
                  id="confirm-password"
                  className="input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                />
                {errors.confirmPassword && <span className="field-error" role="alert">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="btn btn-primary" disabled={status === 'saving'} style={{ width: '100%' }}>
                {status === 'saving' ? (
                  <>
                    <span className="spinner" aria-hidden="true" /> {t('portal.saving')}
                  </>
                ) : (
                  <>
                    <Save aria-hidden="true" size={17} /> {t('portal.savePassword')}
                  </>
                )}
              </button>
            </form>

            <div className="settings-session">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => void logout()}>
                {t('portal.logout')}
              </button>
              <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                Signed in as {user?.loginId} ({user?.role})
              </span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}