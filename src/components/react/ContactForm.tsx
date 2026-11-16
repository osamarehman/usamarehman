import { useState, type SyntheticEvent } from 'react';
import { SITE } from '../../data/site';
import { ArrowRight } from '../Icons';

export default function ContactForm() {
  const [status, setStatus] = useState('');

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '');
    const email = String(data.get('email') || '');
    const workflow = String(data.get('workflow') || '');
    const tools = String(data.get('tools') || 'Not specified');
    const subject = `Project enquiry from ${name}`;
    const body = `Hi Usama,\n\nThe workflow costing us the most hours:\n${workflow}\n\nTools involved:\n${tools}\n\nFrom:\n${name}\n${email}`;
    setStatus(`Your email app should open with the draft. If it does not, email ${SITE.email}.`);
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="contact-form" action={`mailto:${SITE.email}`} method="post" encType="text/plain" onSubmit={handleSubmit}>
      <p className="terminal-command"><span>$</span> start-project</p>
      <div className="form-field form-field-full">
        <label htmlFor="workflow"><span>?</span> What workflow is costing you the most hours?</label>
        <textarea id="workflow" name="workflow" rows={4} placeholder="The process, where it slows down, and what a better day would look like" required />
      </div>
      <div className="form-field form-field-full">
        <label htmlFor="tools"><span>?</span> Which tools does it touch? <small>Optional</small></label>
        <input id="tools" name="tools" type="text" placeholder="A spreadsheet, your CRM, Stripe, email, anything else" />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="contact-name"><span>?</span> Your name</label>
          <input id="contact-name" name="name" type="text" autoComplete="name" placeholder="First name is fine" required />
        </div>
        <div className="form-field">
          <label htmlFor="contact-email"><span>?</span> Your email</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
        </div>
      </div>
      <div className="form-submit">
        <button className="button" type="submit">Create email draft <ArrowRight size={15} /></button>
        <p>This opens your email app. Nothing is sent from this page.</p>
      </div>
      {status && <p className="form-status" role="status">{status}</p>}
    </form>
  );
}
