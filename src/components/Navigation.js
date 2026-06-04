import './Navigation.css';
import { iconDownload } from '../icons.js';

export function renderNavigation() {
  const links = ['Home', 'Projects', 'Skills', 'Experience', 'Certifications', 'Contact'];

  return `
    <nav class="nav">
      <div class="nav__logo">
        <span class="nav__logo-text">FH</span>
      </div>

      <div class="nav__links">
        ${links.map((link, i) => `
          <a href="#${link.toLowerCase()}" class="nav__link">
            ${i === 0 ? '<span class="nav__link-prefix">&gt;_</span>' : ''}
            ${link}
          </a>
        `).join('')}
      </div>

      <a href="/Fardin_Hossain_Resume.pdf" download class="nav__download-btn">
        ${iconDownload(16, 'nav__download-icon')}
        <span class="nav__download-text-full">Download Resume</span>
        <span class="nav__download-text-short">Resume</span>
      </a>
    </nav>
  `;
}
