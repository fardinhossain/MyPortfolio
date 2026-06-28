const RIFF_HEADER_SIZE = 12;
const CHUNK_HEADER_SIZE = 8;
const JIFFY_DURATION_MS = 1000 / 60;
const CURSOR_SIZE = 16;
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

export function selectCurSize(arrayBuffer, targetSize = CURSOR_SIZE) {
  const view = new DataView(arrayBuffer);
  if (view.byteLength < 22 || view.getUint16(0, true) !== 0 || view.getUint16(2, true) !== 2) {
    throw new Error('Invalid CUR cursor frame.');
  }

  const imageCount = view.getUint16(4, true);
  const entries = [];

  for (let index = 0; index < imageCount; index += 1) {
    const offset = 6 + index * 16;
    if (offset + 16 > view.byteLength) break;

    entries.push({
      offset,
      width: view.getUint8(offset) || 256,
      height: view.getUint8(offset + 1) || 256,
      byteLength: view.getUint32(offset + 8, true),
      imageOffset: view.getUint32(offset + 12, true),
    });
  }

  const chosen = entries
    .filter((entry) => entry.imageOffset + entry.byteLength <= view.byteLength)
    .sort((a, b) => {
      const aDistance = Math.abs(Math.max(a.width, a.height) - targetSize);
      const bDistance = Math.abs(Math.max(b.width, b.height) - targetSize);
      return aDistance - bDistance || Math.max(a.width, a.height) - Math.max(b.width, b.height);
    })[0];

  if (!chosen) throw new Error('CUR cursor contains no usable images.');

  const output = new ArrayBuffer(22 + chosen.byteLength);
  const outputView = new DataView(output);
  const outputBytes = new Uint8Array(output);
  const sourceBytes = new Uint8Array(arrayBuffer);

  outputView.setUint16(0, 0, true);
  outputView.setUint16(2, 2, true);
  outputView.setUint16(4, 1, true);
  outputBytes.set(sourceBytes.subarray(chosen.offset, chosen.offset + 16), 6);
  outputView.setUint32(18, 22, true);
  outputBytes.set(sourceBytes.subarray(chosen.imageOffset, chosen.imageOffset + chosen.byteLength), 22);

  return output;
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
  let pointerUrl;
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
    const [cursorResponse, pointerResponse] = await Promise.all([
      fetch('/cursor.ani'),
      fetch('/pointer.cur'),
    ]);
    if (!cursorResponse.ok) throw new Error(`Unable to load cursor.ani (${cursorResponse.status}).`);
    if (!pointerResponse.ok) throw new Error(`Unable to load pointer.cur (${pointerResponse.status}).`);

    const parsed = parseAniCursor(await cursorResponse.arrayBuffer());
    frameUrls = parsed.frames.map((frame) => URL.createObjectURL(new Blob([selectCurSize(frame)], { type: 'image/x-icon' })));
    pointerUrl = URL.createObjectURL(new Blob([selectCurSize(await pointerResponse.arrayBuffer())], { type: 'image/x-icon' }));
    document.documentElement.style.setProperty('--portfolio-pointer', `url("${pointerUrl}"), pointer`);
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
    if (pointerUrl) URL.revokeObjectURL(pointerUrl);
  }, { once: true });
}
