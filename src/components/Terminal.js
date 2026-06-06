import './Terminal.css';
import { iconPlay, iconFolderGit2, iconFastForward } from '../icons.js';

const CODE_STRING = `// Welcome to my workspace
const Profile = {
  greeting: "Hello, I'm",
  name: "MD. FARDIN HOSSAIN",
  avatar: {
    profile: "/fardin.png"  },
  status: "Available for Opportunities",
  roles: [
    "Computer Science Student",
    "Aspiring Software Engineer",
    "AI & ML Enthusiast",
    "Full-Stack Developer",
    "Cybersecurity Learner"
  ],
  bio: "I build intelligent, scalable and secure solutions ..."
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
      <a href="#experience" class="terminal__action-btn terminal__action-btn--run" id="terminal-run-btn">
        ${iconPlay(14, 'terminal-icon-play')} Run Profile
      </a>
      <a href="#projects" class="terminal__action-btn terminal__action-btn--projects" id="terminal-projects-btn">
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
  const runBtn = document.getElementById('terminal-run-btn');
  const projectsBtn = document.getElementById('terminal-projects-btn');

  if (!container || !codeEl || !skipBtn) return;

  let typedText = '';
  let typingComplete = false;
  let typingInterval = null;
  let currentIndex = 0;
  let hasTypedOnce = false;

  const isMobile = window.innerWidth < 1024;
  let backdropEl = null;

  function dismissPopup() {
    if (!isMobile || !container.classList.contains('terminal--mobile-popup')) return;
    
    container.classList.add('terminal--fade-out');
    if (backdropEl) {
      backdropEl.classList.add('terminal-backdrop--fade-out');
    }

    setTimeout(() => {
      container.classList.remove('terminal--mobile-popup');
      container.classList.remove('terminal--fade-out');
      if (backdropEl && backdropEl.parentNode) {
        backdropEl.parentNode.removeChild(backdropEl);
      }
      backdropEl = null;
    }, 400);
  }

  // Setup mobile popup overlay on initial load
  if (isMobile) {
    backdropEl = document.createElement('div');
    backdropEl.className = 'terminal-backdrop';
    document.body.appendChild(backdropEl);
    container.classList.add('terminal--mobile-popup');
  }

  function startTyping() {
    if (hasTypedOnce) {
      skipToEnd();
      return;
    }

    // Reset state
    typedText = '';
    typingComplete = false;
    currentIndex = 0;
    skipBtn.style.display = '';

    typingInterval = setInterval(() => {
      currentIndex++;
      typedText = CODE_STRING.slice(0, currentIndex);
      codeEl.textContent = typedText + '▋';

      // Sync character reveal
      if (typeof window.syncHeroCardReveal === 'function') {
        window.syncHeroCardReveal(typedText, false);
      }

      // Re-highlight each frame
      if (typeof Prism !== 'undefined') {
        Prism.highlightElement(codeEl);
      }

      if (currentIndex >= CODE_STRING.length) {
        clearInterval(typingInterval);
        typingInterval = null;
        typingComplete = true;
        hasTypedOnce = true;
        skipBtn.style.display = 'none';
        codeEl.textContent = typedText;
        if (typeof Prism !== 'undefined') {
          Prism.highlightElement(codeEl);
        }
        if (typeof window.syncHeroCardReveal === 'function') {
          window.syncHeroCardReveal(CODE_STRING, true);
        }
        dismissPopup();
      }
    }, 18);
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
    hasTypedOnce = true;
    skipBtn.style.display = 'none';
    codeEl.textContent = typedText;
    if (typeof Prism !== 'undefined') {
      Prism.highlightElement(codeEl);
    }
    if (typeof window.syncHeroCardReveal === 'function') {
      window.syncHeroCardReveal(CODE_STRING, true);
    }
    dismissPopup();
  }

  // Action event handlers
  skipBtn.addEventListener('click', skipToEnd);
  if (runBtn) {
    runBtn.addEventListener('click', skipToEnd);
  }
  if (projectsBtn) {
    projectsBtn.addEventListener('click', skipToEnd);
  }

  // IntersectionObserver to replace useInView
  const observer = new IntersectionObserver(
    (entries) => {
      const isMobileViewport = window.innerWidth < 1024;
      if (isMobileViewport) return; // Ignore observer on mobile to let it auto-run to completion

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Scrolled into view — start typing
          stopTyping();
          startTyping();
        } else {
          // Scrolled out of view — reset only if not typed yet
          stopTyping();
          if (!hasTypedOnce) {
            typedText = '';
            typingComplete = false;
            currentIndex = 0;
            codeEl.textContent = '';
            skipBtn.style.display = 'none';
            if (typeof window.syncHeroCardReveal === 'function') {
              window.syncHeroCardReveal('', false);
            }
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(container);

  // Start typing immediately on load/init
  startTyping();
}
