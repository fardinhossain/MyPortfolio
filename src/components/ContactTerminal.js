import './ContactTerminal.css';
import { iconMapPin, iconLinkedin, iconGithub, iconMail, iconSend, iconTerminalSquare } from '../icons.js';
import { RESUME_DATA } from '../data.js';

export function renderContactTerminal() {
  return `
    <div class="contact-terminal">
      <div class="contact-terminal__header">
        ${iconTerminalSquare(16, 'contact-terminal__header-icon')}
        <h2 class="contact-terminal__header-title">Contact Terminal</h2>
      </div>

      <div class="contact-terminal__prompt">
        <span class="contact-terminal__prompt-user">fardin@portfolio:</span><span class="contact-terminal__prompt-tilde">~</span>$ <span class="contact-terminal__prompt-cmd">contact</span>
      </div>

      <div class="contact-terminal__content">
        <div class="contact-terminal__details">
          <p class="contact-terminal__intro">Have a project, opportunity, or idea in mind? Send me a message and I’ll get back to you.</p>

          <div class="contact-terminal__grid">
            <div class="contact-terminal__item">
              <div class="contact-terminal__item-label">${iconMail(12, 'contact-terminal__item-label-icon')} Email</div>
              <a href="mailto:${RESUME_DATA.contact.email}" class="contact-terminal__item-value contact-terminal__item-value--link">${RESUME_DATA.contact.email}</a>
            </div>
            <div class="contact-terminal__item">
              <div class="contact-terminal__item-label">${iconMapPin(12, 'contact-terminal__item-label-icon')} Location</div>
              <span class="contact-terminal__item-value">Dhaka, Bangladesh</span>
            </div>
            <div class="contact-terminal__item">
              <div class="contact-terminal__item-label">${iconLinkedin(12, 'contact-terminal__item-label-icon')} LinkedIn</div>
              <a href="${RESUME_DATA.contact.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-terminal__item-value contact-terminal__item-value--link">.../fardinhosn</a>
            </div>
            <div class="contact-terminal__item">
              <div class="contact-terminal__item-label">${iconGithub(12, 'contact-terminal__item-label-icon')} GitHub</div>
              <a href="${RESUME_DATA.contact.github}" target="_blank" rel="noopener noreferrer" class="contact-terminal__item-value contact-terminal__item-value--link">github.com/fardinhossain</a>
            </div>
          </div>
        </div>

        <form class="contact-terminal__form" id="contact-form">
          <div class="contact-terminal__form-row">
            <label class="contact-terminal__field">
              <span>Name</span>
              <input type="text" name="name" autocomplete="name" maxlength="100" placeholder="Your name" required>
            </label>
            <label class="contact-terminal__field">
              <span>Email</span>
              <input type="email" name="email" autocomplete="email" maxlength="254" placeholder="you@example.com" required>
            </label>
          </div>

          <label class="contact-terminal__field">
            <span>Subject</span>
            <input type="text" name="subject" maxlength="120" placeholder="What would you like to discuss?" required>
          </label>

          <label class="contact-terminal__field">
            <span>Message</span>
            <textarea name="message" rows="5" minlength="10" maxlength="2000" placeholder="Tell me a little about your idea..." required></textarea>
          </label>

          <label class="contact-terminal__honeypot" aria-hidden="true">
            Website
            <input type="text" name="website" tabindex="-1" autocomplete="off">
          </label>

          <div class="contact-terminal__form-actions">
            <button type="submit" class="contact-terminal__submit">
              ${iconSend(14, 'contact-terminal__submit-icon')}
              <span>Send message</span>
            </button>
            <p class="contact-terminal__status" id="contact-form-status" role="status" aria-live="polite"></p>
          </div>
        </form>
      </div>

      <div class="contact-terminal__footer">
        <p>\u00A9 ${new Date().getFullYear()} MD. FARDIN HOSSAIN. All rights reserved.</p>
      </div>
    </div>
  `;
}

export function initContactTerminal() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-form-status');

  if (!form || !status) return;

  function openEmailFallback(payload) {
    const subject = `[Portfolio] ${payload.subject}`;
    const body = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      '',
      payload.message,
    ].join('\n');
    const mailtoUrl = `mailto:${RESUME_DATA.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.classList.add('contact-terminal__status--success');
    status.textContent = 'Your email app is opening with the message filled in. Press Send to finish.';
    window.location.href = mailtoUrl;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const button = form.querySelector('button[type="submit"]');
    const buttonText = button.querySelector('span');
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    buttonText.textContent = 'Sending...';
    status.className = 'contact-terminal__status';
    status.textContent = 'Sending your message...';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status >= 500) {
          openEmailFallback(payload);
          return;
        }
        throw new Error(data.message || 'Unable to send your message right now.');
      }

      form.reset();
      status.classList.add('contact-terminal__status--success');
      status.textContent = data.message || 'Message sent successfully. Thank you!';
    } catch (error) {
      status.classList.add('contact-terminal__status--error');
      status.textContent = error.message || 'Unable to send your message right now.';
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      buttonText.textContent = 'Send message';
    }
  });
}
