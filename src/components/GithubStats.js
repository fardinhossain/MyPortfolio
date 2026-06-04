import './GithubStats.css';
import { iconGithub, iconLoader2 } from '../icons.js';

/**
 * Generate mock contribution graph data once (so it doesn't change on re-render).
 * 5 rows × 30 cols of small squares with random opacities.
 */
function generateContribGraph() {
  let rows = '';
  for (let i = 0; i < 5; i++) {
    let cells = '';
    for (let j = 0; j < 30; j++) {
      const opacity = Math.random() > 0.6 ? Math.random().toFixed(2) : '0.1';
      cells += `<div class="github-stats__contrib-cell" style="opacity:${opacity}"></div>`;
    }
    rows += `<div class="github-stats__contrib-row">${cells}</div>`;
  }
  return rows;
}

const CONTRIB_HTML = generateContribGraph();

export function renderGithubStats() {
  // Initial loading state
  return `<div class="github-stats github-stats--loading" id="github-stats-root">
    <div class="github-stats__loader-icon">${iconLoader2(32, 'github-loader')}</div>
    <span class="github-stats__loader-text">Fetching GitHub data...</span>
  </div>`;
}

export function initGithubStats() {
  const root = document.getElementById('github-stats-root');
  if (!root) return;

  async function fetchGithubData() {
    let stats = { repos: 0, stars: 0 };
    let languages = [];

    try {
      const username = 'fardinhossain';

      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100`),
      ]);

      const userData = await userRes.json();
      const reposData = await reposRes.json();

      let totalStars = 0;
      const langCounts = {};

      if (Array.isArray(reposData)) {
        reposData.forEach((repo) => {
          totalStars += repo.stargazers_count;
          if (repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
          }
        });
      }

      stats = {
        repos: userData.public_repos || 0,
        stars: totalStars,
      };

      // Calculate percentages and sort languages
      const totalLangs = Object.values(langCounts).reduce((a, b) => a + b, 0);
      const colors = ['#10b981', '#3b82f6', '#f59e0b'];

      languages = Object.entries(langCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, count], index) => {
          let displayName = name;
          if (name === 'JavaScript') displayName = 'JS';
          else if (name === 'TypeScript') displayName = 'TS';
          else if (name === 'Jupyter Notebook') displayName = 'Jupyter';
          else if (name.length > 10) displayName = name.substring(0, 10) + '...';

          return {
            name: displayName,
            value: Math.round((count / totalLangs) * 100) || 0,
            color: colors[index % colors.length],
          };
        });
    } catch (error) {
      console.error('Failed to fetch GitHub stats:', error);
      // Realistic fallback data for Fardin Hossain when API rate limits are hit
      stats = {
        repos: 7,
        stars: 1,
      };
      languages = [
        { name: 'JS', value: 40, color: '#10b981' },
        { name: 'Python', value: 20, color: '#3b82f6' },
        { name: 'Dart', value: 20, color: '#f59e0b' }
      ];
    }

    renderPopulated(stats, languages);
  }

  function renderPopulated(stats, languages) {
    // Fallback if no languages
    const displayLangs = languages.length > 0
      ? languages
      : [{ name: 'Unknown', value: 100, color: '#64748b' }];

    // Build conic gradient
    let currentPercentage = 0;
    const gradientStops = displayLangs.map((lang) => {
      const start = currentPercentage;
      const end = currentPercentage + lang.value;
      currentPercentage = end;
      return `${lang.color} ${start}% ${end}%`;
    });
    if (currentPercentage < 100) {
      gradientStops.push(`#1a0f0f ${currentPercentage}% 100%`);
    }
    const conicGradient = `conic-gradient(${gradientStops.join(', ')})`;

    // Language bars HTML
    const langBarsHTML = displayLangs.map((lang) =>
      `<div class="github-stats__lang-row">
        <div class="github-stats__lang-name" title="${lang.name}">${lang.name}</div>
        <div class="github-stats__lang-track">
          <div class="github-stats__lang-fill" style="width:${lang.value}%;background-color:${lang.color}"></div>
        </div>
        <div class="github-stats__lang-percent">${lang.value}%</div>
      </div>`
    ).join('');

    root.className = 'github-stats';
    root.innerHTML = `
      <div class="github-stats__header">
        <div class="github-stats__header-left">
          ${iconGithub(20, 'github-header-icon')}
          <h2 class="github-stats__header-title">Github Analytics</h2>
        </div>
        <a href="https://github.com/fardinhossain" target="_blank" rel="noreferrer" class="github-stats__header-link">
          username: <span class="github-stats__header-username">fardinhossain</span>
        </a>
      </div>

      <div class="github-stats__grid">
        <div class="github-stats__stat-card">
          <p class="github-stats__stat-label"><span class="github-stats__stat-dot github-stats__stat-dot--sky"></span> Repos</p>
          <p class="github-stats__stat-value" id="github-stat-repos">${stats.repos}</p>
        </div>
        <div class="github-stats__stat-card">
          <p class="github-stats__stat-label"><span class="github-stats__stat-dot github-stats__stat-dot--amber"></span> Stars</p>
          <p class="github-stats__stat-value" id="github-stat-stars">${stats.stars}</p>
        </div>
        <div class="github-stats__stat-card">
          <p class="github-stats__stat-label"><span class="github-stats__stat-dot github-stats__stat-dot--emerald"></span> Commits</p>
          <p class="github-stats__stat-value">326</p>
        </div>
        <div class="github-stats__stat-card">
          <p class="github-stats__stat-label"><span class="github-stats__stat-dot github-stats__stat-dot--rose"></span> Contrib</p>
          <p class="github-stats__stat-value">245</p>
        </div>
      </div>

      <!-- Mock Contribution Graph -->
      <div class="github-stats__contrib-graph">
        ${CONTRIB_HTML}
      </div>

      <div class="github-stats__lang-section">
        <div class="github-stats__donut" style="background:${conicGradient}">
          <div class="github-stats__donut-hole"></div>
        </div>
        <div class="github-stats__lang-bars">
          ${langBarsHTML}
        </div>
      </div>
    `;
  }

  fetchGithubData();
}
