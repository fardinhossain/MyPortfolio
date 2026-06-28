const RIFF_HEADER_SIZE = 12;
const CHUNK_HEADER_SIZE = 8;
const JIFFY_DURATION_MS = 1000 / 60;
const INTERACTIVE_SELECTOR = 'a, button, select, input[type="button"], input[type="submit"], input[type="reset"], input[type="checkbox"], input[type="radio"], [role="button"], [role="gridcell"], [tabindex]:not([tabindex="-1"])';

function readFourCC(view, offset) {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3),
  );
}

function walkChunks(view, start, end, visit) {
  let offset = start;

  while (offset + CHUNK_HEADER_SIZE <= end) {
    const id = readFourCC(view, offset);
    const size = view.getUint32(offset + 4, true);
    const dataStart = offset + CHUNK_HEADER_SIZE;
    const dataEnd = dataStart + size;
    if (dataEnd > end || dataEnd > view.byteLength) break;

    visit(id, dataStart, size);

    if ((id === 'LIST' || id === 'RIFF') && size >= 4) {
      walkChunks(view, dataStart + 4, dataEnd, visit);
    }

    offset = dataEnd + (size % 2);
  }
}

function readDwordArray(view, offset, size) {
  const values = [];
  const count = Math.floor(size / 4);
  for (let index = 0; index < count; index += 1) {
    values.push(view.getUint32(offset + index * 4, true));
  }
  return values;
}

export function parseAniCursor(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  if (view.byteLength < RIFF_HEADER_SIZE || readFourCC(view, 0) !== 'RIFF' || readFourCC(view, 8) !== 'ACON') {
    throw new Error('Invalid ANI cursor file.');
  }

  const frames = [];
  let defaultRate = 10;
  let rates = [];
  let sequence = [];

  walkChunks(view, RIFF_HEADER_SIZE, view.byteLength, (id, offset, size) => {
    if (id === 'anih' && size >= 32) {
      defaultRate = view.getUint32(offset + 28, true) || defaultRate;
    } else if (id === 'rate') {
      rates = readDwordArray(view, offset, size);
    } else if (id === 'seq ') {
      sequence = readDwordArray(view, offset, size);
    } else if (id === 'icon') {
      frames.push(arrayBuffer.slice(offset, offset + size));
    }
  });

  if (!frames.length) throw new Error('ANI cursor contains no frames.');

  const frameOrder = sequence.length ? sequence : frames.map((_, index) => index);
  const steps = frameOrder
    .map((frameIndex, stepIndex) => ({
      frame: frames[frameIndex],
      duration: Math.max(16, (rates[stepIndex] || defaultRate) * JIFFY_DURATION_MS),
    }))
    .filter((step) => step.frame);

  return { frames, steps };
}

export async function initCustomCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let animationTimer;
  let frameUrls = [];
  let currentStep = 0;
  let steps = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function stopAnimation() {
    window.clearTimeout(animationTimer);
  }

  function showFrame() {
    if (!steps.length) return;

    const step = steps[currentStep];
    const frameUrl = frameUrls[step.frameIndex];
    document.documentElement.style.setProperty(
      '--portfolio-cursor',
      `url("${frameUrl}"), url("/cursor.png") 2 2, auto`,
    );
    document.documentElement.classList.add('custom-cursor-enabled');

    if (reducedMotion.matches || document.hidden) return;
    currentStep = (currentStep + 1) % steps.length;
    animationTimer = window.setTimeout(showFrame, step.duration);
  }

  function restartAnimation() {
    stopAnimation();
    if (!document.hidden) showFrame();
  }

  try {
    const response = await fetch('/cursor.ani');
    if (!response.ok) throw new Error(`Unable to load cursor.ani (${response.status}).`);

    const parsed = parseAniCursor(await response.arrayBuffer());
    frameUrls = parsed.frames.map((frame) => URL.createObjectURL(new Blob([frame], { type: 'image/x-icon' })));
    const frameIndexByBuffer = new Map(parsed.frames.map((frame, index) => [frame, index]));
    steps = parsed.steps.map((step) => ({
      frameIndex: frameIndexByBuffer.get(step.frame),
      duration: step.duration,
    }));

    showFrame();
  } catch (error) {
    console.warn('Animated cursor fallback:', error);
    document.documentElement.style.setProperty('--portfolio-cursor', 'url("/cursor.png") 2 2, auto');
    document.documentElement.classList.add('custom-cursor-enabled');
  }

  document.addEventListener('pointerover', (event) => {
    const element = event.target instanceof Element ? event.target : null;
    document.documentElement.classList.toggle('custom-pointer-active', Boolean(element?.closest(INTERACTIVE_SELECTOR)));
  }, { passive: true });

  document.addEventListener('visibilitychange', restartAnimation);
  reducedMotion.addEventListener('change', restartAnimation);
  window.addEventListener('beforeunload', () => {
    stopAnimation();
    frameUrls.forEach((url) => URL.revokeObjectURL(url));
  }, { once: true });
}
