import './HeroCard.css';
import { iconGithub, iconLinkedin, iconMail, iconMapPin } from '../icons.js';

export function renderHeroCard() {
  return `<div class="hero-card" id="hero-card-root">
    <!-- Background Glow -->
    <div class="hero-card__bg-glow">
      <div class="hero-card__bg-glow-blob"></div>
      <div class="hero-card__bg-glow-line"></div>
    </div>

    <!-- Image Section -->
    <div class="hero-card__image-section">
      <div class="hero-card__available-badge">
        <div class="hero-card__available-dot"></div>
        Available
      </div>

      <div class="hero-card__photo-ring">
        <div class="hero-card__spin-border"></div>
        <div class="hero-card__spin-border-dashed"></div>

        <div class="hero-card__photo-inner">
          <img
            src="/fardin-anime.png"
            alt="Fardin Hossain"
            class="hero-card__photo-anime"
            id="hero-photo-anime"
          />
          <img
            src="/fardin-real.png"
            alt="Fardin Hossain Real"
            class="hero-card__photo-real"
            id="hero-photo-real"
          />
          <svg class="hero-card__fallback-svg" id="hero-fallback-svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>
        </div>
      </div>

      <!-- Desktop-only Skill Radar -->
      <div class="hero-card__skill-radar">
        <div class="hero-card__skill-radar-header">
          <span class="hero-card__skill-radar-label">Skill Radar</span>
          <div class="hero-card__skill-radar-live">
            <span class="hero-card__skill-radar-live-dot"></span>
            <span class="hero-card__skill-radar-live-text">Live</span>
          </div>
        </div>

        <div class="hero-card__metrics-box">
          <div class="hero-card__metrics-list">
            <div class="hero-card__metric-row">
              <span class="hero-card__metric-label">Frontend</span>
              <div class="hero-card__metric-track">
                <div class="hero-card__metric-fill hero-card__metric-fill--frontend"></div>
              </div>
            </div>
            <div class="hero-card__metric-row">
              <span class="hero-card__metric-label">Backend</span>
              <div class="hero-card__metric-track">
                <div class="hero-card__metric-fill hero-card__metric-fill--backend"></div>
              </div>
            </div>
            <div class="hero-card__metric-row">
              <span class="hero-card__metric-label">AI / ML</span>
              <div class="hero-card__metric-track">
                <div class="hero-card__metric-fill hero-card__metric-fill--aiml"></div>
              </div>
            </div>
            <div class="hero-card__metric-row">
              <span class="hero-card__metric-label">Cyber</span>
              <div class="hero-card__metric-track">
                <div class="hero-card__metric-fill hero-card__metric-fill--cyber"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="hero-card__info">
      <h3 class="hero-card__greeting">Hello, I'm</h3>
      <h1 class="hero-card__name">
        <span class="hero-card__name-first">MD. FARDIN</span>
        <span class="hero-card__name-last">HOSSAIN</span>
      </h1>

      <div class="hero-card__roles">
        <p class="hero-card__role-line"><span class="hero-card__role-arrow">&gt;</span> <span class="hero-card__role-label">Computer Science</span> <span class="hero-card__role-value">Student</span></p>
        <p class="hero-card__role-line"><span class="hero-card__role-arrow">&gt;</span> <span class="hero-card__role-label">Aspiring</span> <span class="hero-card__role-value">Software Engineer</span></p>
        <p class="hero-card__role-line"><span class="hero-card__role-arrow">&gt;</span> <span class="hero-card__role-label">AI</span> <span class="hero-card__role-value">Enthusiast</span></p>
        <p class="hero-card__role-line"><span class="hero-card__role-arrow">&gt;</span> <span class="hero-card__role-label">Full-Stack</span> <span class="hero-card__role-value">Developer</span></p>
        <p class="hero-card__role-line"><span class="hero-card__role-arrow">&gt;</span> <span class="hero-card__role-label">Cybersecurity</span> <span class="hero-card__role-value">Learner</span></p>
      </div>

      <p class="hero-card__bio">
        I build intelligent, scalable and secure solutions that solve real-world problems using modern technologies.
      </p>

      <div class="hero-card__socials">
        <a href="#contact" class="hero-card__social-link">${iconGithub(16, 'hero-icon-github')}</a>
        <a href="#contact" class="hero-card__social-link">${iconLinkedin(16, 'hero-icon-linkedin')}</a>
        <a href="#contact" class="hero-card__social-link">${iconMail(16, 'hero-icon-mail')}</a>
        <a href="#contact" class="hero-card__social-link">${iconMapPin(16, 'hero-icon-mappin')}</a>
      </div>
    </div>
  </div>`;
}

export function initHeroCard() {
  const animeImg = document.getElementById('hero-photo-anime');
  const realImg = document.getElementById('hero-photo-real');
  const fallbackSvg = document.getElementById('hero-fallback-svg');

  if (animeImg) {
    animeImg.addEventListener('error', () => {
      animeImg.style.display = 'none';
      if (fallbackSvg) fallbackSvg.style.display = 'block';
    });
  }

  if (realImg) {
    realImg.addEventListener('error', () => {
      realImg.style.display = 'none';
    });
  }
}
