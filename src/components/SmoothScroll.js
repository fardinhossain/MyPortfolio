const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function getWheelDistance(event) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 18;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * window.innerHeight;
  return event.deltaY;
}

function hasScrollableParent(target, deltaY) {
  let element = target instanceof Element ? target : null;

  while (element && element !== document.documentElement) {
    const styles = window.getComputedStyle(element);
    const canOverflow = /(auto|scroll)/.test(styles.overflowY);
    const hasOverflow = element.scrollHeight > element.clientHeight + 1;

    if (canOverflow && hasOverflow) {
      const canScrollUp = deltaY < 0 && element.scrollTop > 0;
      const canScrollDown = deltaY > 0 && element.scrollTop + element.clientHeight < element.scrollHeight - 1;
      if (canScrollUp || canScrollDown) return true;
    }

    element = element.parentElement;
  }

  return false;
}

export function initSmoothScroll() {
  const reducedMotion = window.matchMedia(REDUCED_MOTION);
  const finePointer = window.matchMedia(FINE_POINTER);
  let currentPosition = window.scrollY;
  let targetPosition = currentPosition;
  let animationFrame = null;

  function isEnabled() {
    return finePointer.matches && !reducedMotion.matches;
  }

  function getMaximumScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function stopAnimation() {
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    animationFrame = null;
    currentPosition = window.scrollY;
    targetPosition = currentPosition;
    document.documentElement.classList.remove('smooth-scroll-active');
  }

  function animateScroll() {
    const distance = targetPosition - currentPosition;
    currentPosition += distance * 0.14;

    if (Math.abs(distance) < 0.4) {
      currentPosition = targetPosition;
      window.scrollTo(0, currentPosition);
      animationFrame = null;
      document.documentElement.classList.remove('smooth-scroll-active');
      return;
    }

    window.scrollTo(0, currentPosition);
    animationFrame = window.requestAnimationFrame(animateScroll);
  }

  function scrollToPosition(position) {
    currentPosition = window.scrollY;
    targetPosition = clamp(position, 0, getMaximumScroll());
    document.documentElement.classList.add('smooth-scroll-active');

    if (animationFrame === null) {
      animationFrame = window.requestAnimationFrame(animateScroll);
    }
  }

  function handleWheel(event) {
    if (!isEnabled() || event.ctrlKey || document.body.classList.contains('certificate-modal-open')) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

    const distance = getWheelDistance(event);
    if (!distance || hasScrollableParent(event.target, distance)) return;

    event.preventDefault();
    const startingPoint = animationFrame === null ? window.scrollY : targetPosition;
    targetPosition = clamp(startingPoint + clamp(distance, -220, 220), 0, getMaximumScroll());
    currentPosition = animationFrame === null ? window.scrollY : currentPosition;
    document.documentElement.classList.add('smooth-scroll-active');

    if (animationFrame === null) {
      animationFrame = window.requestAnimationFrame(animateScroll);
    }
  }

  function handleAnchorClick(event) {
    if (!isEnabled() || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    const destination = document.querySelector(hash);
    if (!destination) return;

    event.preventDefault();
    window.history.pushState(null, '', hash);
    scrollToPosition(destination.getBoundingClientRect().top + window.scrollY - 24);
  }

  function handleNativeScroll() {
    if (animationFrame !== null) return;
    currentPosition = window.scrollY;
    targetPosition = currentPosition;
  }

  function handlePreferenceChange() {
    if (!isEnabled()) stopAnimation();
  }

  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('scroll', handleNativeScroll, { passive: true });
  window.addEventListener('resize', stopAnimation, { passive: true });
  window.addEventListener('keydown', (event) => {
    if (SCROLL_KEYS.has(event.key)) stopAnimation();
  });
  document.addEventListener('click', handleAnchorClick);
  reducedMotion.addEventListener('change', handlePreferenceChange);
  finePointer.addEventListener('change', handlePreferenceChange);

  if (window.location.hash) {
    window.requestAnimationFrame(() => {
      const destination = document.querySelector(window.location.hash);
      if (destination && isEnabled()) {
        scrollToPosition(destination.getBoundingClientRect().top + window.scrollY - 24);
      }
    });
  }
}
