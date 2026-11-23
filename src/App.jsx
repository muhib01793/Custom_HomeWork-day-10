import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, CircleHelp, Clock3, FileText, Info, LayoutDashboard, LifeBuoy, LogOut, Plane, Plus, Settings, ShieldCheck, Sparkles, UserRound, X } from 'lucide-react';

const initialValues = { name: 'Alex Morgan', email: 'alex.morgan@company.com', department: 'Product & Design', leaveType: '', startDate: '', endDate: '', reason: '' };
const steps = [{ number: '01', title: 'Your details' }, { number: '02', title: 'Leave dates' }, { number: '03', title: 'Review & submit' }];

function workingDays(start, end) {
  if (!start || !end) return 0;
  const cursor = new Date(`${start}T12:00:00`);
  const last = new Date(`${end}T12:00:00`);
  let days = 0;
  while (cursor <= last) {
    if (cursor.getDay() !== 0 && cursor.getDay() !== 6) days += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function App() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [notice, setNotice] = useState('');
  const dayCount = useMemo(() => workingDays(values.startDate, values.endDate), [values.startDate, values.endDate]);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setNotice('');
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = 'Please enter your full name.';
    if (!values.email.trim()) next.email = 'Please enter your work email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Enter a valid email address.';
    if (!values.department) next.department = 'Please choose a department.';
    if (!values.leaveType) next.leaveType = 'Please select a leave type.';
    if (!values.startDate) next.startDate = 'Choose the first day of your leave.';
    if (!values.endDate) next.endDate = 'Choose the last day of your leave.';
    if (values.startDate && values.endDate && values.endDate < values.startDate) next.endDate = 'End date must be on or after the start date.';
    if (values.startDate && values.startDate < new Date().toLocaleDateString('en-CA')) next.startDate = 'Start date cannot be in the past.';
    if (!values.reason.trim()) next.reason = 'Please add a short reason for your request.';
    else if (values.reason.trim().length < 10) next.reason = 'Please add a little more detail (at least 10 characters).';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (reviewing) {
      setSubmitted(true);
      setReviewing(false);
      return;
    }
    if (!validate()) {
      setNotice('A few details need your attention. Check the highlighted fields below.');
      document.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setReviewing(true);
    setActiveStep(3);
  }

  function resetForm() {
    setValues({ ...initialValues, name: '', email: '', department: '' });
    setErrors({});
    setSubmitted(false);
    setReviewing(false);
    setActiveStep(1);
    setNotice('');
  }

  const minDate = new Date().toLocaleDateString('en-CA');
  const errorText = (field) => errors[field] && <span className="field-error" role="alert">{errors[field]}</span>;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Sparkles size={18} fill="currentColor" /></div><span>people<span className="brand-light">desk</span></span></div>
        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace-switch"><div className="workspace-icon">N</div><div><strong>Northstar Studio</strong><small>People team</small></div><ChevronDown size={15} /></div>
        <nav className="main-nav"><a href="#dashboard"><LayoutDashboard size={18} />Dashboard</a><a className="nav-active" href="#request"><CalendarDays size={18} />Leave & time off<span className="nav-count">2</span></a><a href="#profile"><UserRound size={18} />My profile</a></nav>
        <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><LifeBuoy size={17} /></div><strong>Need a hand?</strong><p>Our People team is here for you.</p><a href="mailto:people@company.com">Contact People team <ArrowRight size={13} /></a></div><nav className="utility-nav"><a href="#settings"><Settings size={17} />Settings</a><a href="#help"><CircleHelp size={17} />Help center</a></nav><div className="user-profile"><div className="avatar">AM</div><div><strong>Alex Morgan</strong><small>Product Designer</small></div><LogOut size={16} /></div></div>
      </aside>

      <main className="main-area" id="request">
        <header className="topbar"><div className="breadcrumb"><span>Leave & time off</span><span className="crumb-slash">/</span><strong>New request</strong></div><div className="topbar-right"><span className="secure-label"><ShieldCheck size={15} />Your information is secure</span><div className="top-avatar">AM</div></div></header>
        <div className="page-content">
          <a href="#back" className="back-link"><ArrowLeft size={15} />Back to leave</a>
          <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot" />TIME OFF</div><h1>Request time off</h1><p>Plan a little time for yourself. We'll take care of the rest.</p></div><div className="balance-card"><div className="balance-icon"><CalendarDays size={17} /></div><div><span>YOUR PTO BALANCE</span><strong>12 <small>days remaining</small></strong></div><a href="#balance" aria-label="View balance"><ArrowRight size={16} /></a></div></div>

          <div className="stepper" aria-label="Request progress">{steps.map((step, index) => { const number = index + 1; const complete = submitted || number < activeStep; return <div className={`step ${number === activeStep ? 'current' : ''} ${complete ? 'complete' : ''}`} key={step.number}><div className="step-circle">{complete ? <Check size={14} /> : step.number}</div><span>{step.title}</span>{index < steps.length - 1 && <div className="step-line" />}</div>; })}</div>

          {submitted ? <section className="success-card"><div className="success-icon"><CheckCircle2 size={29} /></div><div className="success-kicker">REQUEST SUBMITTED</div><h2>Time to look forward to it.</h2><p>Your request has been sent to your manager for review. We'll let you know as soon as there's an update.</p><div className="success-summary"><div><span>LEAVE TYPE</span><strong>{values.leaveType}</strong></div><div><span>DATES</span><strong>{formatDate(values.startDate)} – {formatDate(values.endDate)}</strong></div><div><span>DURATION</span><strong>{dayCount} working {dayCount === 1 ? 'day' : 'days'}</strong></div></div><button className="primary-button" onClick={resetForm}>Make another request <ArrowRight size={16} /></button></section> : reviewing ? <section className="success-card review-card"><div className="success-icon review-icon"><FileText size={25} /></div><div className="success-kicker">FINAL STEP</div><h2>Review your request</h2><p>Take a moment to make sure everything looks right before you send it to your manager.</p><div className="review-details"><div><span>REQUESTER</span><strong>{values.name}</strong><small>{values.email} · {values.department}</small></div><div><span>LEAVE TYPE</span><strong>{values.leaveType}</strong></div><div><span>DATES</span><strong>{formatDate(values.startDate)} – {formatDate(values.endDate)}</strong><small>{dayCount} working {dayCount === 1 ? 'day' : 'days'}</small></div><div><span>REASON</span><strong>{values.reason}</strong></div></div><div className="review-actions"><button className="secondary-button" onClick={() => { setReviewing(false); setActiveStep(1); }}>Edit request</button><button className="primary-button" onClick={handleSubmit}>Submit request <ArrowRight size={16} /></button></div></section> : <form className="request-card" onSubmit={handleSubmit} noValidate>
            <section className="form-section"><div className="section-heading"><div className="section-number">01</div><div><h2>Your details</h2><p>Let us know who's taking time off.</p></div><span className="required-note"><i /> Required fields</span></div>
              <div className="form-grid"><label className="field"><span>Full name <b>*</b></span><div className={`input-wrap ${errors.name ? 'has-error' : ''}`}><UserRound size={16} /><input value={values.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Alex Morgan" autoComplete="name" /></div>{errorText('name')}</label><label className="field"><span>Work email <b>*</b></span><div className={`input-wrap ${errors.email ? 'has-error' : ''}`}><span className="at-icon">@</span><input type="email" value={values.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" autoComplete="email" /></div>{errorText('email')}</label><label className="field field-wide"><span>Department <b>*</b></span><div className={`select-wrap ${errors.department ? 'has-error' : ''}`}><select value={values.department} onChange={(e) => update('department', e.target.value)}><option value="">Choose your department</option><option>Product & Design</option><option>Engineering</option><option>Marketing</option><option>People & Operations</option><option>Sales</option><option>Finance</option></select><ChevronDown size={16} /></div>{errorText('department')}</label></div>
            </section>

            <section className="form-section"><div className="section-heading"><div className="section-number">02</div><div><h2>Leave dates</h2><p>When would you like to take time off?</p></div></div>
              <div className="form-grid"><fieldset className={`field field-wide leave-type-field ${errors.leaveType ? 'has-error' : ''}`}><legend>Leave type <b>*</b></legend><div className="leave-options"><label className={`leave-option ${values.leaveType === 'Paid time off' ? 'selected' : ''}`}><input type="radio" name="leaveType" value="Paid time off" checked={values.leaveType === 'Paid time off'} onChange={(e) => update('leaveType', e.target.value)} /><span className="leave-emoji">🌿</span><span><strong>Paid time off</strong><small>Vacation & personal days</small></span><span className="radio-dot" /></label><label className={`leave-option ${values.leaveType === 'Sick leave' ? 'selected' : ''}`}><input type="radio" name="leaveType" value="Sick leave" checked={values.leaveType === 'Sick leave'} onChange={(e) => update('leaveType', e.target.value)} /><span className="leave-emoji">💛</span><span><strong>Sick leave</strong><small>Rest & recovery</small></span><span className="radio-dot" /></label><label className={`leave-option ${values.leaveType === 'Other' ? 'selected' : ''}`}><input type="radio" name="leaveType" value="Other" checked={values.leaveType === 'Other'} onChange={(e) => update('leaveType', e.target.value)} /><span className="leave-emoji">✳️</span><span><strong>Other</strong><small>Something else</small></span><span className="radio-dot" /></label></div>{errorText('leaveType')}</fieldset>
                <label className="field"><span>First day <b>*</b></span><div className={`input-wrap date-wrap ${errors.startDate ? 'has-error' : ''}`}><input type="date" min={minDate} value={values.startDate} onChange={(e) => update('startDate', e.target.value)} /></div>{errorText('startDate')}</label><label className="field"><span>Last day <b>*</b></span><div className={`input-wrap date-wrap ${errors.endDate ? 'has-error' : ''}`}><input type="date" min={values.startDate || minDate} value={values.endDate} onChange={(e) => update('endDate', e.target.value)} /></div>{errorText('endDate')}</label>
                <div className="duration-strip"><div className="duration-icon"><Clock3 size={16} /></div><div><strong>{dayCount || '—'} {dayCount === 1 ? 'working day' : 'working days'}</strong><span>Weekends aren't included in your total.</span></div><Info size={15} className="duration-info" /></div>
              </div>
            </section>

            <section className="form-section reason-section"><div className="section-heading"><div className="section-number">03</div><div><h2>A little more about your request</h2><p>Share anything your manager should know.</p></div></div><label className="field"><span>Reason for leave <b>*</b></span><textarea className={errors.reason ? 'has-error' : ''} value={values.reason} onChange={(e) => update('reason', e.target.value)} placeholder="Add a short note for your manager..." maxLength={300} rows={4} /><div className="textarea-meta">{errorText('reason')}<span>{values.reason.length}/300</span></div></label></section>
            {notice && <div className="notice" role="status"><Info size={16} />{notice}</div>}
            <footer className="form-footer"><span><ShieldCheck size={15} />Your request is only shared with your manager.</span><div><button type="button" className="secondary-button" onClick={() => { setValues(initialValues); setErrors({}); setNotice(''); }}>Clear form</button><button type="submit" className="primary-button">Review request <ArrowRight size={16} /></button></div></footer>
          </form>}
          <div className="page-footnote"><span>Questions about your leave?</span><a href="mailto:people@company.com">Talk to your People team <ArrowRight size={13} /></a><span className="footnote-version">PeopleDesk <span>·</span> v1.0</span></div>
        </div>
      </main>
    </div>
  );
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default App;
