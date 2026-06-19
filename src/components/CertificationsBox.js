import './CertificationsBox.css';
import { iconAward, iconX } from '../icons.js';
import { RESUME_DATA } from '../data.js';

function getCertificationTitle(cert) {
  return typeof cert === 'string' ? cert : cert.title;
}

function renderCertificationCard(cert) {
  const title = getCertificationTitle(cert);
  const hasCertificate = typeof cert === 'object' && cert.certificate;
  const verifiedLabel = hasCertificate ? 'View Certificate' : 'Verified';
  const cardContent = `
    <div class="certs__card-emoji-wrap">
      <span class="certs__card-emoji">\u{1F3C6}</span>
    </div>
    <p class="certs__card-text">${title}</p>
    <div class="certs__card-verified">
      <span class="certs__card-verified-label">
        ${verifiedLabel} ${iconAward(12, 'certs__card-verified-icon')}
      </span>
    </div>
  `;

  if (hasCertificate) {
    return `
      <button
        type="button"
        class="certs__card certs__card--interactive"
        data-certificate-trigger="${cert.id}"
        aria-haspopup="dialog"
        aria-controls="certificate-modal"
        aria-label="View ${title} certificate"
      >
        ${cardContent}
      </button>
    `;
  }

  return `<div class="certs__card">${cardContent}</div>`;
}

function renderCertificateArtwork(cert) {
  return `
    <article class="certificate-paper" aria-label="${cert.title} certificate">
      <div class="certificate-paper__pattern" aria-hidden="true"></div>

      <div class="certificate-paper__top">
        <div class="certificate-paper__official">
          <span>OFFICIAL</span>
          <strong>CERTIFICATION</strong>
        </div>

        <div class="certificate-paper__brand" aria-label="${cert.issuer}">
          <strong>mile<span>2</span></strong>
          <p>CYBERSECURITY CERTIFICATIONS</p>
        </div>
      </div>

      <div class="certificate-paper__rule"></div>

      <p class="certificate-paper__statement">THIS DOCUMENT CERTIFIES THAT</p>
      <div class="certificate-paper__name">${cert.recipient}</div>

      <p class="certificate-paper__statement">HAS ATTAINED THE DESIGNATION OF</p>
      <div class="certificate-paper__designation">${cert.title}</div>

      <div class="certificate-paper__meta">
        <div>
          <p>DATE: <span>${cert.date}</span></p>
          <p>CERTIFICATE ID#: <span>${cert.certificateId}</span></p>
        </div>
        <p>VALID THROUGH: <span>${cert.validThrough}</span></p>
      </div>

      <div class="certificate-paper__footer">
        <div class="certificate-paper__signature">
          <strong>Raymond Friedman</strong>
          <span>CEO &amp; President</span>
        </div>
        <div class="certificate-paper__badges" aria-hidden="true">
          <span>FBI</span>
          <span>CNSS</span>
          <span>NST</span>
          <span>NICCS</span>
        </div>
      </div>
    </article>
  `;
}

function renderCertificateModal() {
  const certificate = RESUME_DATA.certifications.find(
    cert => typeof cert === 'object' && cert.certificate
  );

  if (!certificate) return '';

  return `
    <div
      id="certificate-modal"
      class="certificate-modal"
      role="dialog"
      aria-modal="true"
      aria-hidden="true"
      aria-labelledby="certificate-modal-title"
      data-certificate-modal
    >
      <div class="certificate-modal__dialog" role="document">
        <button
          type="button"
          class="certificate-modal__close"
          aria-label="Close certificate"
          data-certificate-close
        >
          ${iconX(20, 'certificate-modal__close-icon')}
        </button>

        <div class="certificate-modal__viewport">
          <h3 id="certificate-modal-title" class="certificate-modal__title">
            ${certificate.title}
          </h3>
          ${renderCertificateArtwork(certificate)}
        </div>
      </div>
    </div>
  `;
}

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
        ${RESUME_DATA.certifications.map(renderCertificationCard).join('')}
      </div>
    </div>

    ${renderCertificateModal()}
  `;
}

export function initCertificationsBox() {
  const modal = document.querySelector('[data-certificate-modal]');
  const triggers = document.querySelectorAll('[data-certificate-trigger]');

  if (!modal || !triggers.length) return;

  const closeButton = modal.querySelector('[data-certificate-close]');
  let previousFocus = null;

  const getFocusableElements = () => Array.from(
    modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(element => !element.disabled && element.offsetParent !== null);

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('certificate-modal-open');

    if (previousFocus && document.contains(previousFocus)) {
      previousFocus.focus({ preventScroll: true });
    }
  };

  const openModal = () => {
    previousFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('certificate-modal-open');
    closeButton?.focus({ preventScroll: true });
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', openModal);
  });

  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.closest('[data-certificate-close]')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', event => {
    if (!modal.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeModal();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}
