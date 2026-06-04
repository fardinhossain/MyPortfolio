import './components/Navigation.css';
import './components/HeroCard.css';
import './components/Terminal.css';
import './components/StatsBar.css';
import './components/SkillsDashboard.css';
import './components/ProjectsList.css';
import './components/GithubStats.css';
import './components/ExperienceRoadmap.css';
import './components/CertificationsBox.css';
import './components/ChatWidget.css';
import './components/ContactTerminal.css';

import { renderNavigation } from './components/Navigation.js';
import { renderHeroCard } from './components/HeroCard.js';
import { renderTerminal } from './components/Terminal.js';
import { renderStatsBar } from './components/StatsBar.js';
import { renderSkillsDashboard } from './components/SkillsDashboard.js';
import { renderProjectsList } from './components/ProjectsList.js';
import { renderGithubStats } from './components/GithubStats.js';
import { renderExperienceRoadmap } from './components/ExperienceRoadmap.js';
import { renderCertificationsBox } from './components/CertificationsBox.js';
import { renderChatWidget } from './components/ChatWidget.js';
import { renderContactTerminal } from './components/ContactTerminal.js';

export function renderApp() {
  return `
    <div class="app-wrapper">
      ${renderNavigation()}
      
      <main class="app-main">
        
        <!-- Top Row: Hero and Terminal -->
        <div id="home" class="grid-top-row">
          ${renderHeroCard()}
          ${renderTerminal()}
        </div>

        <!-- Stats Row -->
        ${renderStatsBar()}

        <!-- Full-Width Projects -->
        <div id="projects" class="section-full">
          ${renderProjectsList()}
        </div>

        <!-- Middle Row: Skills and Chat -->
        <div id="skills" class="grid-skills-row">
          ${renderSkillsDashboard()}
          ${renderChatWidget()}
        </div>

        <!-- Github & Experience -->
        <div id="experience" class="grid-experience-row">
          ${renderGithubStats()}
          ${renderExperienceRoadmap()}
        </div>

        <!-- Full-width Certifications -->
        <div id="certifications" class="section-full">
          ${renderCertificationsBox()}
        </div>
      </main>

      <div id="contact" class="section-contact">
        ${renderContactTerminal()}
      </div>
    </div>
  `;
}

export async function initApp() {
  // Import init functions dynamically to ensure they exist
  const { initHeroCard } = await import('./components/HeroCard.js');
  const { initTerminal } = await import('./components/Terminal.js');
  const { initSkillsDashboard } = await import('./components/SkillsDashboard.js');
  const { initGithubStats } = await import('./components/GithubStats.js');
  const { initChatWidget } = await import('./components/ChatWidget.js');

  // Initialize interactive components
  if (typeof initHeroCard === 'function') initHeroCard();
  if (typeof initTerminal === 'function') initTerminal();
  if (typeof initSkillsDashboard === 'function') initSkillsDashboard();
  if (typeof initGithubStats === 'function') initGithubStats();
  if (typeof initChatWidget === 'function') initChatWidget();
}
