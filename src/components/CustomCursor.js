const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const INTERACTIVE_SELECTOR = 'a, button, select, input[type="button"], input[type="submit"], input[type="reset"], input[type="checkbox"], input[type="radio"], [role="button"], [role="gridcell"], [tabindex]:not([tabindex="-1"])';

export function initCustomCursor() {
  const finePointer = window.matchMedia(FINE_POINTER);

  if (document.querySelector('.custom-cursor')) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = `
    <img class="custom-cursor__asset custom-cursor__asset--default" src="/cursor.png" alt="" draggable="false">
    <img class="custom-cursor__asset custom-cursor__asset--pointer" src="/pointer.png" alt="" draggable="false">
  `;
  document.body.appendChild(cursor);

  const defaultCursor = cursor.querySelector('.custom-cursor__asset--default');
  const pointerCursor = cursor.querySelector('.custom-cursor__asset--pointer');

  function isEnabled() {
    return finePointer.matches;
  }

  function setTransform(element, x, y) {
    element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(var(--cursor-scale, 1))`;
  }

  function updateCursorState(target) {
    const element = target instanceof Element ? target : null;
    cursor.classList.toggle('is-interactive', Boolean(element?.closest(INTERACTIVE_SELECTOR)));
  }

  function handlePointerMove(event) {
    if (!isEnabled() || event.pointerType === 'touch') return;

    setTransform(defaultCursor, event.clientX, event.clientY);
    setTransform(pointerCursor, event.clientX, event.clientY);

    document.documentElement.classList.add('custom-cursor-enabled');
    cursor.classList.add('is-visible');
    updateCursorState(event.target);
  }

  function disableCursor() {
    cursor.classList.remove('is-visible', 'is-interactive', 'is-pressed');
    document.documentElement.classList.remove('custom-cursor-enabled');
  }

  document.addEventListener('pointermove', handlePointerMove, { passive: true });
  document.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'), { passive: true });
  document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'), { passive: true });
  document.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget) cursor.classList.remove('is-visible');
  });
  window.addEventListener('blur', () => cursor.classList.remove('is-visible'));
  finePointer.addEventListener('change', disableCursor);
}
