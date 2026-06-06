import './StatsBar.css';
import { iconCode2, iconBrainCircuit, iconGraduationCap } from '../icons.js';

export function renderStatsBar() {
  const stats = [
    { value: '3+', label: 'Projects Completed', iconFn: iconCode2 },
    { value: 'Software Engineer', label: 'Focused', iconFn: iconCode2 },
    { value: 'AI & ML Engineer', label: 'Enthusiast', iconFn: iconBrainCircuit },
    { value: 'B.Sc. in CSE', label: 'Southeast University', iconFn: iconGraduationCap },
  ];

  return `
    <div class="stats-bar">
      ${stats.map(stat => `
        <div class="stats-bar__card">
          <div class="stats-bar__icon-wrap">
            ${stat.iconFn(24, 'stats-bar__icon')}
          </div>
          <div>
            <h4 class="stats-bar__value">${stat.value}</h4>
            <p class="stats-bar__label">${stat.label}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
