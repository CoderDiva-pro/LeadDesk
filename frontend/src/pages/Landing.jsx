import { useState } from 'react';
import { submitLead } from '../api.js';
import Footer from '../components/Footer.jsx';

const BUDGETS = [
  { value: '', label: 'Select a budget range' },
  { value: 'under-1k', label: 'Under $1,000' },
  { value: '1k-5k', label: '$1,000 – $5,000' },
  { value: '5k-15k', label: '$5,000 – $15,000' },
  { value: '15k-50k', label: '$15,000 – $50,000' },
  { value: '50k-plus', label: '$50,000+' },
];

function validate(form) {
  const errors = {};
  if (!form.name.trim() || form.name.trim().length < 2) {
    errors.name = 'Enter your full name.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!form.budgetRange) {
    errors.budgetRange = 'Choose a budget range.';
  }
  if (!form.message.trim() || form.message.trim().length < 10) {
    errors.message = 'Tell us a bit more (at least 10 characters).';
  }
  return errors;
}

export default function Landing() {
  const [form, setForm] = useState({ name: '', email: '', budgetRange: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverError, setServerError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const clientErrors = validate(form);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setStatus('submitting');
    setServerError('');
    try {
      await submitLead(form);
      setStatus('success');
      setForm({ name: '', email: '', budgetRange: '', message: '' });
    } catch (err) {
      setStatus('error');
      setServerError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">LeadDesk Mini</p>
        <h1>Tell us about the project. We'll take it from here.</h1>
        <p className="hero-sub">
          A few details now saves a week of back-and-forth later — share the shape of
          your budget and what you're trying to build, and we'll follow up directly.
        </p>
      </header>

      <main className="form-card">
        {status === 'success' ? (
          <div className="success-panel">
            <h2>Message received.</h2>
            <p>Thanks — we've got your details and will be in touch shortly.</p>
            <button className="btn-secondary" onClick={() => setStatus('idle')}>
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Jordan Blake"
                autoComplete="name"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jordan@company.com"
                autoComplete="email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="budgetRange">Budget range</label>
              <select
                id="budgetRange"
                name="budgetRange"
                value={form.budgetRange}
                onChange={handleChange}
              >
                {BUDGETS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
              {errors.budgetRange && <span className="field-error">{errors.budgetRange}</span>}
            </div>

            <div className="field">
              <label htmlFor="message">What are you trying to build?</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder="A quick sketch of the project, timeline, or problem you're solving..."
              />
              {errors.message && <span className="field-error">{errors.message}</span>}
            </div>

            {serverError && <p className="form-error">{serverError}</p>}

            <button className="btn-primary" type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
