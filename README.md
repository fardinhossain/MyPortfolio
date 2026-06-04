
# Md. Fardin Hossain — Software Engineering Portfolio

[![Node.js Version](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)

**Software Engineer | Full-Stack Developer | AI Integration Specialist**

A high-performance, single-page application built to demonstrate my expertise in modern web development, backend API integration, and production-grade security practices. This portfolio serves as both a showcase of my past projects and a technical demonstration of my software engineering capabilities.

---

## 🏗️ Architecture & Technologies

The application is built on a modern JavaScript stack, utilizing component-based UI rendering without the overhead of heavy frontend frameworks.

- **Frontend:** HTML5, CSS3, ES6+ JavaScript Modules
- **Backend API:** Node.js, Express.js
- **Tooling & Bundling:** Vite, esbuild
- **Third-Party Integrations:** GitHub REST API, OpenRouter API
- **Syntax Highlighting:** Prism.js (Loaded via secure Subresource Integrity)
- **Security Suite:** `helmet`, `cors`, `express-rate-limit`, `dompurify`

---

## ⚙️ Core Features

### Interactive Terminal Simulation
Developed a real-time character-by-character typing simulation that mimics a developer's workspace. It integrates Prism.js for accurate syntax highlighting and utilizes the `IntersectionObserver` API for performant rendering when the component enters the viewport.

### Embedded AI Assistant
Built a custom chat interface connected to advanced language models via the OpenRouter API. 
- **State Management:** Handles asynchronous messaging state and loading indicators.
- **Backend Integration:** Routes traffic through a dedicated Express server to conceal API credentials.
- **Security Mechanisms:** Implemented strict input validation, system prompt hardening, and IP-based rate limiting to prevent API abuse.

### Dynamic GitHub Analytics
Engineered a live analytics dashboard that interfaces with the GitHub REST API to fetch and render real-time repository data, star counts, and language distribution, complete with fallback mechanisms for API rate limits.

---

## 🛡️ Security Implementation

This application implements strict security standards to ensure production readiness:

1. **Build Isolation:** Backend binaries (`server.bundle.cjs`) are explicitly isolated from the public frontend `dist/` directory to prevent source code disclosure.
2. **HTTP Hardening:** Protected by the `helmet` middleware suite to enforce secure HTTP headers (e.g., Content-Security-Policy, Strict-Transport-Security).
3. **Cross-Site Scripting (XSS) Mitigation:** All user-facing dynamic inputs and AI-generated outputs are strictly sanitized using `DOMPurify` prior to DOM injection.
4. **Rate Limiting:** Implemented `express-rate-limit` on critical API endpoints to mitigate Financial Denial of Service (FDoS) attacks against third-party API quotas.
5. **CORS & Data Validation:** Enforces strict Cross-Origin Resource Sharing policies and validates all payload sizes and types before backend processing.

---

## 🚀 Local Development

### 1. Prerequisites
Ensure **[Node.js](https://nodejs.org/) (v18 or higher)** is installed on your local environment.

### 2. Installation
Clone the repository and install the required dependencies:
```bash
git clone https://github.com/fardinhossain/MyPortfolio.git
cd MyPortfolio
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory to configure the OpenRouter API:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```
*(Note: The `.env` file is safely ignored by source control to prevent credential leakage.)*

### 4. Running the Application
To start the local development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

### 5. Production Build
To compile the client application and bundle the backend for production environments:
```bash
npm run build
npm start
```

---

## 📬 Contact

**Md. Fardin Hossain**  
Software Engineer  
Email: [fardin.hosn@gmail.com](mailto:fardin.hosn@gmail.com)  
GitHub: [fardinhossain](https://github.com/fardinhossain)  
LinkedIn: [fardinhosn](https://www.linkedin.com/in/fardinhosn)
