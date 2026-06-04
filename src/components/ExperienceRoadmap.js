import './ExperienceRoadmap.css';
import { iconRocket, iconGraduationCap, iconCode2, iconBrainCircuit, iconShieldCheck } from '../icons.js';

export function renderExperienceRoadmap() {
  const experiences = [
    { year: '2022', title: 'Started B.Sc. in Computer Science', desc: 'Southeast University', iconFn: iconGraduationCap },
    { year: '2024', title: 'Full-Stack Development', desc: 'Built multiple web applications & real-world projects', iconFn: iconCode2 },
    { year: '2025', title: 'AI & Machine Learning', desc: 'Working on AI models & real-world AI applications', iconFn: iconBrainCircuit },
    { year: '2026', title: 'Cybersecurity Projects', desc: 'Conducted security assessments & penetration testing', iconFn: iconShieldCheck },
    { year: 'Future', title: 'AI/Software Engineer', desc: 'Building intelligent & secure solutions for the future', iconFn: iconRocket },
  ];

  return `
    <div class="exp-roadmap">
      <div class="exp-roadmap__header">
        <div class="exp-roadmap__header-icon-wrap">
          ${iconRocket(16, 'exp-roadmap__header-icon')}
        </div>
        <h2 class="exp-roadmap__header-title">Experience Roadmap</h2>
      </div>

      <div class="exp-roadmap__timeline">
        <div class="exp-roadmap__timeline-line"></div>

        <div class="exp-roadmap__items">
          ${experiences.map(exp => `
            <div class="exp-roadmap__item">
              <div class="exp-roadmap__item-dot">
                ${exp.iconFn(16, 'exp-roadmap__item-icon')}
              </div>
              <div class="exp-roadmap__item-content">
                <div class="exp-roadmap__item-top">
                  <span class="exp-roadmap__item-year">${exp.year}</span>
                  <h3 class="exp-roadmap__item-title">${exp.title}</h3>
                </div>
                <p class="exp-roadmap__item-desc">${exp.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
