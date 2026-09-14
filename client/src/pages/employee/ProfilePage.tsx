import { Award, BadgeCheck, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import SEO from '../../components/SEO';
import { useAuth } from '../../auth/AuthContext';
import { useT } from '../../i18n/LanguageContext';

export default function EmployeeProfilePage() {
  const { user } = useAuth();
  const t = useT();
  const emp = user?.employee;

  return (
    <>
      <SEO title="My Profile | MANISH ELECTRICALS" />
      <div className="portal-page">
        <header className="portal-page-head">
          <div>
            <span className="eyebrow">{t('portal.employeePortal')}</span>
            <h1>{t('portal.myProfile')}</h1>
          </div>
        </header>

        <div className="card profile-card">
          <div className="profile-photo-lg" aria-hidden="true">
            {emp?.profilePhoto ? (
              <img src={emp.profilePhoto} alt="" />
            ) : (
              (emp?.fullName ?? user?.loginId ?? 'U').charAt(0).toUpperCase()
            )}
          </div>

          <div className="profile-main">
            <h2 style={{ fontSize: '1.4rem', marginBottom: 4 }}>{emp?.fullName || user?.loginId}</h2>
            <div className="employee-chips">
              {emp?.employeeId && <span className="badge">{emp.employeeId}</span>}
              {emp?.designation && <span className="badge outline">{emp.designation}</span>}
              {emp?.status && <span className="badge outline">{emp.status}</span>}
            </div>
          </div>

          <div className="profile-fields">
            <ProfileField icon={<UserRound aria-hidden="true" size={16} />} label={t('portal.employeeId')} value={emp?.employeeId || '-'} />
            <ProfileField icon={<Award aria-hidden="true" size={16} />} label={t('portal.designation')} value={emp?.designation || '-'} />
            <ProfileField
              icon={<MapPin aria-hidden="true" size={16} />}
              label={t('portal.workLocation')}
              value={emp?.workLocation || '-'}
            />
            <ProfileField icon={<Phone aria-hidden="true" size={16} />} label={t('portal.phone')} value={emp?.mobileNumber || '-'} />
            <ProfileField icon={<Mail aria-hidden="true" size={16} />} label={t('portal.loginId')} value={user?.loginId || '-'} />
            <ProfileField
              icon={<BadgeCheck aria-hidden="true" size={16} />}
              label={t('portal.accountStatus')}
              value=""
              fallbackValue={user?.role === 'admin' ? t('login.admin') : t('login.employee')}
            />
          </div>

          <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: 18, marginBottom: 0 }}>
            {t('portal.profileNote')}
          </p>
        </div>
      </div>
    </>
  );
}

function ProfileField({ icon, label, value, fallbackValue }: { icon: ReactNode; label: string; value: string; fallbackValue?: string }) {
  const display = value || fallbackValue || '-';
  return (
    <div className="profile-field">
      <span className="profile-field-icon">{icon}</span>
      <div>
        <span className="profile-field-label">{label}</span>
        <span className="profile-field-value">{display}</span>
      </div>
    </div>
  );
}