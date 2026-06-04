import './CertificationsBox.css';
import { iconAward } from '../icons.js';
import { RESUME_DATA } from '../data.js';

export function renderCertificationsBox() {
  return `
    <div class="certs">
      <div class="certs__bg-glow"></div>

      <div class="certs__header">
        <div class="certs__header-icon-wrap">
          ${iconAward(24, 'certs__header-icon')}
        </div>
        <div>
          <h2 class="certs__title">Professional Certifications</h2>
          <p class="certs__subtitle">Continuous Learning</p>
        </div>
      </div>

      <div class="certs__scroll-row">
        ${RESUME_DATA.certifications.map(cert => `
          <div class="certs__card">
            <div class="certs__card-emoji-wrap">
              <span class="certs__card-emoji">\u{1F3C6}</span>
            </div>
            <p class="certs__card-text">${cert}</p>
            <div class="certs__card-verified">
              <span class="certs__card-verified-label">
                Verified ${iconAward(12, 'certs__card-verified-icon')}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
