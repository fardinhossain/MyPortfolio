import './Terminal.css';
import { iconPlay, iconFolderGit2, iconFastForward } from '../icons.js';

const CODE_STRING = `// Welcome to my workspace
import { Developer } from './universe.js';

const Portfolio = () => {
  return {
    developer: {
      name: "Md. Fardin Hossain",
      role: "Software Engineer",
      passion: "AI Engineer Enthusiast",
      skills: [
        "Full-Stack Development",
        "Artificial Intelligence",
        "Cybersecurity"
      ],
      mission: "Building intelligent solutions that create real impact",
      status: "Open to Internships & Opportunities"
    }
  };
};`;

export function renderTerminal() {
  return `<div class="terminal" id="terminal-root">
    <!-- Title Bar -->
    <div class="terminal__title-bar">
      <div class="terminal__dots">
        <div class="terminal__dot terminal__dot--red"></div>
        <div class="terminal__dot terminal__dot--yellow"></div>
        <div class="terminal__dot terminal__dot--green"></div>
      </div>
      <div class="terminal__title-center">
        <span class="terminal__title-dot"></span>
        <span class="terminal__title-text">portfolio.js</span>
      </div>
      <div class="terminal__title-spacer"></div>
    </div>

    <!-- Editor Content -->
    <div class="terminal__editor">
      <pre class="line-numbers language-javascript"><code class="language-javascript" id="terminal-code"></code></pre>
    </div>

    <!-- Bottom Actions -->
    <div class="terminal__actions">
      <a href="#experience" class="terminal__action-btn terminal__action-btn--run">
        ${iconPlay(14, 'terminal-icon-play')} Run Profile
      </a>
      <a href="#projects" class="terminal__action-btn terminal__action-btn--projects">
        ${iconFolderGit2(14, 'terminal-icon-folder')} View Projects
      </a>
      <button class="terminal__action-btn terminal__action-btn--skip" id="terminal-skip-btn" style="display:none;">
        ${iconFastForward(14, 'terminal-icon-skip')} Skip
      </button>
    </div>
  </div>`;
}

export function initTerminal() {
  const container = document.getElementById('terminal-root');
  const codeEl = document.getElementById('terminal-code');
  const skipBtn = document.getElementById('terminal-skip-btn');

  if (!container || !codeEl || !skipBtn) return;

  let typedText = '';
  let typingComplete = false;
  let typingInterval = null;
  let currentIndex = 0;

  function startTyping() {
    // Reset state
    typedText = '';
    typingComplete = false;
    currentIndex = 0;
    skipBtn.style.display = '';

    typingInterval = setInterval(() => {
      currentIndex++;
      typedText = CODE_STRING.slice(0, currentIndex);
      codeEl.textContent = typedText + '▋';

      // Re-highlight each frame
      if (typeof Prism !== 'undefined') {
        Prism.highlightElement(codeEl);
      }

      if (currentIndex >= CODE_STRING.length) {
        clearInterval(typingInterval);
        typingInterval = null;
        typingComplete = true;
        skipBtn.style.display = 'none';
        codeEl.textContent = typedText;
        if (typeof Prism !== 'undefined') {
          Prism.highlightElement(codeEl);
        }
      }
    }, 45);
  }

  function stopTyping() {
    if (typingInterval) {
      clearInterval(typingInterval);
      typingInterval = null;
    }
  }

  function skipToEnd() {
    stopTyping();
    typedText = CODE_STRING;
    typingComplete = true;
    skipBtn.style.display = 'none';
    codeEl.textContent = typedText;
    if (typeof Prism !== 'undefined') {
      Prism.highlightElement(codeEl);
    }
  }

  // Skip button handler
  skipBtn.addEventListener('click', skipToEnd);

  // IntersectionObserver to replace useInView
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Scrolled into view — start typing
          stopTyping();
          startTyping();
        } else {
          // Scrolled out of view — reset
          stopTyping();
          typedText = '';
          typingComplete = false;
          currentIndex = 0;
          codeEl.textContent = '';
          skipBtn.style.display = 'none';
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(container);
}
