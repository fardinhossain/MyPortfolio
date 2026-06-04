import './ContactTerminal.css';
import { iconPhone, iconMapPin, iconLinkedin, iconGithub, iconMail, iconTerminalSquare } from '../icons.js';
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

      <div class="contact-terminal__grid">
        <div class="contact-terminal__item">
          <div class="contact-terminal__item-label">${iconMail(12, 'contact-terminal__item-label-icon')} Email</div>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${RESUME_DATA.contact.email}" target="_blank" rel="noopener noreferrer" class="contact-terminal__item-value contact-terminal__item-value--link">${RESUME_DATA.contact.email}</a>
        </div>
        <div class="contact-terminal__item">
          <div class="contact-terminal__item-label">${iconPhone(12, 'contact-terminal__item-label-icon')} Phone</div>
          <a href="tel:${RESUME_DATA.contact.phone}" class="contact-terminal__item-value contact-terminal__item-value--link">${RESUME_DATA.contact.phone}</a>
        </div>
        <div class="contact-terminal__item">
          <div class="contact-terminal__item-label">${iconPhone(12, 'contact-terminal__item-label-icon')} WhatsApp</div>
          <a href="https://wa.me/8801992748470" class="contact-terminal__item-value contact-terminal__item-value--link" target="_blank" rel="noopener noreferrer">01992748470</a>
        </div>
        <div class="contact-terminal__item">
          <div class="contact-terminal__item-label">${iconMapPin(12, 'contact-terminal__item-label-icon')} Location</div>
          <span class="contact-terminal__item-value">Dhaka, Bangladesh</span>
        </div>
        <div class="contact-terminal__item">
          <div class="contact-terminal__item-label">${iconLinkedin(12, 'contact-terminal__item-label-icon')} LinkedIn</div>
          <a href="${RESUME_DATA.contact.linkedin}" class="contact-terminal__item-value contact-terminal__item-value--link">.../fardinhosn</a>
        </div>
        <div class="contact-terminal__item">
          <div class="contact-terminal__item-label">${iconGithub(12, 'contact-terminal__item-label-icon')} GitHub</div>
          <a href="https://github.com/fardinhossain" class="contact-terminal__item-value contact-terminal__item-value--link">github.com/fardinhossain</a>
        </div>
      </div>

      <div class="contact-terminal__footer">
        <p>\u00A9 ${new Date().getFullYear()} MD. FARDIN HOSSAIN. All rights reserved.</p>
      </div>
    </div>
  `;
}
