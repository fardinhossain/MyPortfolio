const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [role="button"], [role="gridcell"], [tabindex]:not([tabindex="-1"])';
const TEXT_SELECTOR = 'input:not([type="button"]):not([type="submit"]):not([type="reset"]), textarea, [contenteditable="true"]';

export function initCustomCursor() {
  const finePointer = window.matchMedia(FINE_POINTER);
  const reducedMotion = window.matchMedia(REDUCED_MOTION);

  if (document.querySelector('.custom-cursor')) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = `
    <span class="custom-cursor__ring"></span>
    <span class="custom-cursor__dot"></span>
  `;
  document.body.appendChild(cursor);

  const ring = cursor.querySelector('.custom-cursor__ring');
  const dot = cursor.querySelector('.custom-cursor__dot');
  let pointerX = -100;
  let pointerY = -100;
  let ringX = pointerX;
  let ringY = pointerY;
  let animationFrame = null;
  let hasPosition = false;

  function isEnabled() {
    return finePointer.matches && !reducedMotion.matches;
  }

  function setTransform(element, x, y) {
    element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(var(--cursor-scale, 1))`;
  }

  function animateRing() {
    ringX += (pointerX - ringX) * 0.2;
    ringY += (pointerY - ringY) * 0.2;
    setTransform(ring, ringX, ringY);

    if (Math.abs(pointerX - ringX) > 0.08 || Math.abs(pointerY - ringY) > 0.08) {
      animationFrame = window.requestAnimationFrame(animateRing);
    } else {
      ringX = pointerX;
      ringY = pointerY;
      setTransform(ring, ringX, ringY);
      animationFrame = null;
    }
  }

  function requestRingFrame() {
    if (animationFrame === null) animationFrame = window.requestAnimationFrame(animateRing);
  }

  function updateCursorState(target) {
    const element = target instanceof Element ? target : null;
    cursor.classList.toggle('is-interactive', Boolean(element?.closest(INTERACTIVE_SELECTOR)));
    cursor.classList.toggle('is-text', Boolean(element?.closest(TEXT_SELECTOR)));
  }

  function handlePointerMove(event) {
    if (!isEnabled() || event.pointerType === 'touch') return;

    pointerX = event.clientX;
    pointerY = event.clientY;
    setTransform(dot, pointerX, pointerY);

    if (!hasPosition) {
      ringX = pointerX;
      ringY = pointerY;
      setTransform(ring, ringX, ringY);
      hasPosition = true;
    }

    document.documentElement.classList.add('custom-cursor-enabled');
    cursor.classList.add('is-visible');
    updateCursorState(event.target);
    requestRingFrame();
  }

  function disableCursor() {
    cursor.classList.remove('is-visible', 'is-interactive', 'is-text', 'is-pressed');
    document.documentElement.classList.remove('custom-cursor-enabled');
    hasPosition = false;
  }

  document.addEventListener('pointermove', handlePointerMove, { passive: true });
  document.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'), { passive: true });
  document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'), { passive: true });
  document.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget) cursor.classList.remove('is-visible');
  });
  window.addEventListener('blur', () => cursor.classList.remove('is-visible'));
  finePointer.addEventListener('change', disableCursor);
  reducedMotion.addEventListener('change', disableCursor);
}
