import './SkillsDashboard.css';
import {
  iconTerminalSquare,
  iconLayout,
  iconBrainCircuit,
  iconDatabase,
  iconShieldCheck,
} from '../icons.js';

const CATEGORIES = [
  'All', 'Languages', 'Frontend', 'Backend', 'AI / ML',
  'Database', 'DevOps', 'Cybersecurity', 'Tools',
];

const ICON_MAP = {
  TerminalSquare: iconTerminalSquare,
  Layout: iconLayout,
  BrainCircuit: iconBrainCircuit,
  Database: iconDatabase,
  ShieldCheck: iconShieldCheck,
};

const SKILLS = [
  { name: 'JavaScript', cat: 'Languages', level: 'Advanced', icon: 'TerminalSquare' },
  { name: 'Python', cat: 'Languages', level: 'Advanced', icon: 'TerminalSquare' },
  { name: 'Java', cat: 'Languages', level: 'Intermediate', icon: 'TerminalSquare' },
  { name: 'C/C++', cat: 'Languages', level: 'Intermediate', icon: 'TerminalSquare' },
  { name: 'React', cat: 'Frontend', level: 'Advanced', icon: 'Layout' },
  { name: 'Next.js', cat: 'Frontend', level: 'Intermediate', icon: 'Layout' },
  { name: 'Tailwind CSS', cat: 'Frontend', level: 'Advanced', icon: 'Layout' },
  { name: 'HTML/CSS', cat: 'Frontend', level: 'Advanced', icon: 'Layout' },
  { name: 'Node.js', cat: 'Backend', level: 'Intermediate', icon: 'TerminalSquare' },
  { name: 'Express', cat: 'Backend', level: 'Intermediate', icon: 'TerminalSquare' },
  { name: 'PyTorch', cat: 'AI / ML', level: 'Intermediate', icon: 'BrainCircuit' },
  { name: 'Machine Learning', cat: 'AI / ML', level: 'Advanced', icon: 'BrainCircuit' },
  { name: 'Deep Learning', cat: 'AI / ML', level: 'Intermediate', icon: 'BrainCircuit' },
  { name: 'MongoDB', cat: 'Database', level: 'Intermediate', icon: 'Database' },
  { name: 'Firebase', cat: 'Database', level: 'Intermediate', icon: 'Database' },
  { name: 'Git/GitHub', cat: 'Tools', level: 'Advanced', icon: 'TerminalSquare' },
  { name: 'Postman', cat: 'Tools', level: 'Intermediate', icon: 'TerminalSquare' },
  { name: 'REST API', cat: 'Tools', level: 'Advanced', icon: 'TerminalSquare' },
  { name: 'Linux', cat: 'DevOps', level: 'Intermediate', icon: 'TerminalSquare' },
  { name: 'Pen Testing', cat: 'Cybersecurity', level: 'Intermediate', icon: 'ShieldCheck' },
  { name: 'Web Security', cat: 'Cybersecurity', level: 'Intermediate', icon: 'ShieldCheck' },
  { name: 'OWASP Top 10', cat: 'Cybersecurity', level: 'Intermediate', icon: 'ShieldCheck' },
];

function renderSkillItems(filtered) {
  return filtered.map((skill) => {
    const iconFn = ICON_MAP[skill.icon] || iconTerminalSquare;
    return `<div class="skills-dashboard__skill">
      <div class="skills-dashboard__skill-circle">
        ${iconFn(20, `skill-icon-${skill.name.replace(/[^a-zA-Z0-9]/g, '')}`)}
      </div>
      <span class="skills-dashboard__skill-name">${skill.name}</span>
    </div>`;
  }).join('');
}

export function renderSkillsDashboard() {
  const tabsHTML = CATEGORIES.map((cat) =>
    `<button class="skills-dashboard__tab${cat === 'All' ? ' skills-dashboard__tab--active' : ''}" data-category="${cat}">${cat}</button>`
  ).join('');

  const allSkillsHTML = renderSkillItems(SKILLS);

  return `<div class="skills-dashboard" id="skills-dashboard-root">
    <div class="skills-dashboard__header">
      <div class="skills-dashboard__header-icon">
        ${iconTerminalSquare(16, 'skills-header-icon')}
      </div>
      <h2 class="skills-dashboard__title">My Skills Universe</h2>
    </div>

    <div class="skills-dashboard__content">
      <!-- Categories Sidebar -->
      <div class="skills-dashboard__categories" id="skills-tabs">
        ${tabsHTML}
      </div>

      <!-- Skills Grid -->
      <div class="skills-dashboard__grid-area">
        <div class="skills-dashboard__grid" id="skills-grid">
          ${allSkillsHTML}
        </div>
      </div>
    </div>

    <p class="skills-dashboard__footer">
      Hover to interact &bull; Click to zoom
    </p>
  </div>`;
}

export function initSkillsDashboard() {
  const tabsContainer = document.getElementById('skills-tabs');
  const gridEl = document.getElementById('skills-grid');

  if (!tabsContainer || !gridEl) return;

  let activeTab = 'All';

  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.skills-dashboard__tab');
    if (!btn) return;

    const category = btn.dataset.category;
    if (category === activeTab) return;

    activeTab = category;

    // Update active tab styling
    tabsContainer.querySelectorAll('.skills-dashboard__tab').forEach((tab) => {
      tab.classList.toggle('skills-dashboard__tab--active', tab.dataset.category === activeTab);
    });

    // Re-render filtered skills
    const filtered = activeTab === 'All' ? SKILLS : SKILLS.filter((s) => s.cat === activeTab);
    gridEl.innerHTML = renderSkillItems(filtered);
  });
}
