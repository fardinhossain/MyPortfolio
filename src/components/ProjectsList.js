import './ProjectsList.css';
import { iconCode2, iconArrowRight, iconExternalLink, iconActivity, iconCpu } from '../icons.js';
import { RESUME_DATA } from '../data.js';

export function renderProjectsList() {
  return `
    <div class="projects">
      <div class="projects__bg-hover"></div>

      <div class="projects__header">
        <div class="projects__header-left">
          <div class="projects__header-icon-wrap">
            ${iconCode2(24, 'projects__header-icon')}
          </div>
          <div>
            <h2 class="projects__title">Featured Projects</h2>
            <p class="projects__subtitle">
              ${iconActivity(12, 'projects__pulse-icon')}
              Building the future
            </p>
          </div>
        </div>
        <button class="projects__view-all-btn">
          View All Projects ${iconArrowRight(16, 'projects__arrow-icon')}
        </button>
      </div>

      <div class="projects__grid">
        ${RESUME_DATA.projects.map((project, index) => `
          <div class="projects__card">
            <div class="projects__card-glow-line"></div>

            <div class="projects__card-top">
              <span class="projects__card-year">
                ${project.period.substring(3, 7) || '2025'}
              </span>
              <a href="${project.link}" class="projects__card-link-btn">
                ${iconExternalLink(16, 'projects__card-link-icon')}
              </a>
            </div>

            <h3 class="projects__card-name">
              ${project.name.split(' - ')[0]}
            </h3>

            <p class="projects__card-desc">
              ${project.description}
            </p>

            <div class="projects__card-tags-wrap">
              <div class="projects__card-tags">
                ${(project.tags || []).map((tag, i) => `
                  <span class="projects__card-tag ${i % 3 === 0 ? 'projects__card-tag--emerald' : i % 3 === 1 ? 'projects__card-tag--sky' : 'projects__card-tag--amber'}">
                    ${tag === 'AI/ML' ? iconCpu(12, 'projects__card-tag-icon') : ''} ${tag}
                  </span>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
