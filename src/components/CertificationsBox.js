import './CertificationsBox.css';
import { iconAward, iconX } from '../icons.js';
import { RESUME_DATA } from '../data.js';

function getCertificationTitle(cert) {
  return typeof cert === 'string' ? cert : cert.title;
}

function getCertificateEntries() {
  return RESUME_DATA.certifications.filter(
    cert => typeof cert === 'object' && cert.certificate
  );
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

function renderCertificateModal() {
  const certificates = getCertificateEntries();

  if (!certificates.length) return '';

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
            Certificate Preview
          </h3>
          <div class="certificate-modal__meta">
            <p class="certificate-modal__eyebrow">Verified Certificate</p>
            <p class="certificate-modal__name" data-certificate-title></p>
            <p class="certificate-modal__issuer" data-certificate-issuer></p>
          </div>
          <div class="certificate-modal__image-frame">
            <img class="certificate-modal__image" src="" alt="" data-certificate-image>
          </div>
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

  const certificatesById = new Map(
    getCertificateEntries().map(certificate => [certificate.id, certificate])
  );
  const closeButton = modal.querySelector('[data-certificate-close]');
  const title = modal.querySelector('[data-certificate-title]');
  const issuer = modal.querySelector('[data-certificate-issuer]');
  const image = modal.querySelector('[data-certificate-image]');
  let previousFocus = null;

  if (!closeButton || !title || !issuer || !image) return;

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

  const openModal = certificate => {
    if (!certificate?.certificateImage) return;

    previousFocus = document.activeElement;
    title.textContent = certificate.title;
    issuer.textContent = certificate.issuer || '';
    image.src = certificate.certificateImage;
    image.alt = certificate.certificateAlt || `${certificate.title} certificate`;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('certificate-modal-open');
    closeButton?.focus({ preventScroll: true });
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      openModal(certificatesById.get(trigger.dataset.certificateTrigger));
    });
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
