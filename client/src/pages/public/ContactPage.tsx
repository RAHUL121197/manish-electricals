import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import SEO from '../../components/SEO';
import PageHero from '../../components/PageHero';
import Reveal from '../../components/Reveal';
import { useT } from '../../i18n/LanguageContext';
import { COMPANY, MAPS_EMBED_URL, MAPS_LINK, whatsappLink } from '../../lib/company';

interface FormValues {
  name: string;
  mobile: string;
  email: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY_FORM: FormValues = { name: '', mobile: '', email: '', subject: '', message: '' };

export default function ContactPage() {
  const t = useT();
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const setField = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!values.name.trim()) next.name = t('common.required');
    if (!/^[6-9]\d{9}$/.test(values.mobile.trim())) next.mobile = t('common.invalidMobile');
    if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      next.email = t('common.invalidEmail');
    }
    if (!values.message.trim()) next.message = t('common.required');
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setStatus('sending');
    setSubmitMessage('');

    try {
      const payload = {
        customer_name: values.name.trim(),
        email: values.email.trim(),
        phone: values.mobile.trim(),
        subject: values.subject.trim() || 'General Enquiry',
        message: values.message.trim(),
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({ success: false, message: 'Something went wrong. Please try again.' }));

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Something went wrong. Please try again.');
      }

      setValues(EMPTY_FORM);
      setStatus('success');
      setSubmitMessage(
        'Thank you for contacting Manish Electricals. Your enquiry has been submitted successfully. Our team will contact you shortly.'
      );
    } catch (error) {
      console.error('[contact-form]', error);
      setStatus('error');
      setSubmitMessage(
        error instanceof Error && error.message ? error.message : 'Something went wrong while submitting your enquiry. Please try again.'
      );
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | MANISH ELECTRICALS Surat — +91 99241 09256"
        description="Contact MANISH ELECTRICALS — P No. 17, Kuber Park Society, Ved Road, Surat - 395004. Phone / WhatsApp +91 99241 09256."
      />
      <PageHero
        eyebrow="Get In Touch"
        title={t('contact.heading')}
        desc={t('contact.desc')}
        crumbs={[{ label: t('contact.heading') }]}
      />

      <section className="section" style={{ paddingTop: 80 }}>
        <div className="container contact-grid">
          <Reveal>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{COMPANY.name}</h2>
              <p className="text-muted" style={{ marginBottom: 28 }}>
                {t('contact.desc')}
              </p>

              <div className="contact-info-list">
                <ContactCard
                  icon={<MapPin aria-hidden="true" size={24} />}
                  title={t('contact.address')}
                >
                  <p style={{ margin: 0 }}>{COMPANY.addressShort}</p>
                  <p className="text-muted" style={{ margin: 0 }}>
                    Surat - 395004, Gujarat, India
                  </p>
                </ContactCard>

                <ContactCard
                  icon={<Phone aria-hidden="true" size={24} />}
                  title={t('contact.phone')}
                >
                  <a href={`tel:${COMPANY.phone}`}>{COMPANY.phoneDisplay}</a>
                </ContactCard>

                <ContactCard
                  icon={<MessageCircle aria-hidden="true" size={24} />}
                  title={t('contact.whatsapp')}
                >
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                    {COMPANY.phoneDisplay}
                  </a>
                </ContactCard>

                <ContactCard
                  icon={<Mail aria-hidden="true" size={24} />}
                  title={t('contact.email')}
                >
                  <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                </ContactCard>
              </div>

              <div className="contact-actions">
                <a href={`tel:${COMPANY.phone}`} className="btn call-btn">
                  <Phone aria-hidden="true" size={17} /> {t('common.callNow')}
                </a>
                <a
                  href={whatsappLink(`Hello ${COMPANY.name}, I would like to make an enquiry.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn wa-btn"
                >
                  <MessageCircle aria-hidden="true" size={17} /> {t('common.whatsapp')}
                </a>
                <a href={`mailto:${COMPANY.email}`} className="btn mail-btn">
                  <Mail aria-hidden="true" size={17} /> {t('common.emailUs')}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="form-panel">
              <h2>{t('contact.formTitle')}</h2>
              <p className="text-muted" style={{ marginTop: -14, marginBottom: 22, fontSize: '0.9rem' }}>
                {t('contact.respondNote')}
              </p>

              {status === 'success' && (
                <div className="alert alert-success" role="status">
                  <Send aria-hidden="true" size={16} />
                  {submitMessage || t('contact.success')}
                </div>
              )}
              {status === 'error' && (
                <div className="alert alert-error" role="alert">
                  {submitMessage || t('common.somethingWentWrong')}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="contact-name">{t('contact.name')} *</label>
                    <input
                      id="contact-name"
                      className="input"
                      type="text"
                      value={values.name}
                      onChange={(e) => setField('name', e.target.value)}
                      placeholder={t('contact.placeholderName')}
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                    />
                    {errors.name && <span className="field-error" role="alert">{errors.name}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-mobile">{t('contact.mobile')} *</label>
                    <input
                      id="contact-mobile"
                      className="input"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={values.mobile}
                      onChange={(e) => setField('mobile', e.target.value.replace(/\D/g, ''))}
                      placeholder={t('contact.placeholderMobile')}
                      autoComplete="tel"
                      aria-invalid={Boolean(errors.mobile)}
                    />
                    {errors.mobile && <span className="field-error" role="alert">{errors.mobile}</span>}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-email">{t('contact.emailField')}</label>
                  <input
                    id="contact-email"
                    className="input"
                    type="email"
                    value={values.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder={t('contact.placeholderEmail')}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <span className="field-error" role="alert">{errors.email}</span>}
                </div>

                <div className="form-field">
                  <label htmlFor="contact-subject">{t('contact.subject')}</label>
                  <input
                    id="contact-subject"
                    className="input"
                    type="text"
                    value={values.subject}
                    onChange={(e) => setField('subject', e.target.value)}
                    placeholder={t('contact.placeholderSubject')}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message">{t('contact.message')} *</label>
                  <textarea
                    id="contact-message"
                    className="textarea"
                    value={values.message}
                    onChange={(e) => setField('message', e.target.value)}
                    placeholder={t('contact.placeholderMessage')}
                    aria-invalid={Boolean(errors.message)}
                  />
                  {errors.message && <span className="field-error" role="alert">{errors.message}</span>}
                </div>

                <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'sending'} style={{ width: '100%' }}>
                  {status === 'sending' ? (
                    <>
                      <span className="spinner" aria-hidden="true" /> {t('contact.sending')}
                    </>
                  ) : (
                    <>
                      <Send aria-hidden="true" size={17} /> {t('contact.submit')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </Reveal>
        </div>

        <div className="container">
          <Reveal>
            <div className="map-frame">
              <iframe
                src={MAPS_EMBED_URL}
                title={t('contact.mapTitle')}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
          <p style={{ textAlign: 'center', marginTop: 16 }}>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
              <MapPin aria-hidden="true" size={16} style={{ verticalAlign: 'text-bottom' }} /> {COMPANY.address}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

function ContactCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="contact-card">
      <div className="icon-wrap">{icon}</div>
      <div>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}