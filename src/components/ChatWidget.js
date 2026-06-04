import './ChatWidget.css';
import { iconBot, iconX, iconSend, iconLoader2 } from '../icons.js';
import DOMPurify from 'dompurify';

export function renderChatWidget() {
  return `<div class="chat-widget-wrapper" id="chat-widget-root">
    <div class="chat-widget">
      <!-- Header -->
      <div class="chat-widget__header">
        <div class="chat-widget__header-left">
          ${iconBot(16, 'chat-header-bot')} Fardin's AI <span class="chat-widget__header-badge">BETA</span>
        </div>
        <div class="chat-widget__header-right">
          <div class="chat-widget__header-minimize"></div>
          <div class="chat-widget__header-close">${iconX(16, 'chat-header-close')}</div>
        </div>
      </div>

      <!-- Messages -->
      <div class="chat-widget__messages chat-scrollbar" id="chat-messages">
        <div class="chat-widget__message chat-widget__message--ai">
          👋 Hi! I'm Fardin AI. Ask me anything about Fardin's skills, projects or experience.
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-widget__input-area">
        <div class="chat-widget__quick-replies" id="chat-quick-replies">
          <button class="chat-widget__quick-btn" data-message="Tell me about Fardin">Tell me about Fardin</button>
          <button class="chat-widget__quick-btn" data-message="What technologies does he use?">What technologies does he use?</button>
        </div>
        <div class="chat-widget__input-row">
          <input
            type="text"
            id="chat-input"
            class="chat-widget__input"
            placeholder="Type your question..."
          />
          <button class="chat-widget__send-btn" id="chat-send-btn" disabled>
            ${iconSend(12, 'chat-send-icon')}
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

export function initChatWidget() {
  const messagesEl = document.getElementById('chat-messages');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const quickReplies = document.getElementById('chat-quick-replies');

  if (!messagesEl || !inputEl || !sendBtn) return;

  // State managed via closures
  let messages = [
    { role: 'ai', text: "👋 Hi! I'm Fardin AI. Ask me anything about Fardin's skills, projects or experience." },
  ];
  let isLoading = false;

  function scrollToBottom() {
    messagesEl.scrollTo({
      top: messagesEl.scrollHeight,
      behavior: 'smooth',
    });
  }

  function renderMessages() {
    let html = messages.map((msg) => {
      const cls = msg.role === 'ai' ? 'chat-widget__message--ai' : 'chat-widget__message--user';
      return `<div class="chat-widget__message ${cls}">${escapeHTML(msg.text)}</div>`;
    }).join('');

    if (isLoading) {
      html += `<div class="chat-widget__loading">
        ${iconLoader2(12, 'chat-loading-spinner')} Thinking...
      </div>`;
    }

    messagesEl.innerHTML = html;
    scrollToBottom();
  }

  function escapeHTML(str) {
    return DOMPurify.sanitize(str);
  }

  function updateQuickReplies() {
    if (quickReplies) {
      quickReplies.style.display = messages.length === 1 ? '' : 'none';
    }
  }

  function updateSendBtn() {
    sendBtn.disabled = !inputEl.value.trim() || isLoading;
    inputEl.disabled = isLoading;
  }

  async function handleSend(messageText) {
    if (!messageText.trim() || isLoading) return;

    const userMsg = messageText.trim();
    messages.push({ role: 'user', text: userMsg });
    inputEl.value = '';
    isLoading = true;

    updateQuickReplies();
    updateSendBtn();
    renderMessages();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await response.json();
      messages.push({ role: 'ai', text: data.reply || 'Failed to get response.' });
    } catch (error) {
      messages.push({ role: 'ai', text: "Sorry, I'm currently offline or encountered an error." });
    } finally {
      isLoading = false;
      updateSendBtn();
      renderMessages();
    }
  }

  // Event: Send button click
  sendBtn.addEventListener('click', () => {
    handleSend(inputEl.value);
  });

  // Event: Enter key
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSend(inputEl.value);
    }
  });

  // Event: Input change to toggle send button
  inputEl.addEventListener('input', () => {
    updateSendBtn();
  });

  // Event: Quick reply buttons (event delegation)
  if (quickReplies) {
    quickReplies.addEventListener('click', (e) => {
      const btn = e.target.closest('.chat-widget__quick-btn');
      if (btn) {
        handleSend(btn.dataset.message);
      }
    });
  }

  // Initial state
  updateSendBtn();
}
