'use strict';

// ============================================
// EMAILJS CONFIGURATION
// ============================================
const EMAILJS_CONFIG = {
  PUBLIC_KEY: '6vXIb6WfmdxQw5h-s',
  SERVICE_ID: 'service_d6exzqc',
  TEMPLATE_ID: 'template_9s321iq'
};

// ============================================
// IMAGE SLOT GUIDE: open index.html?slots to outline every spot that needs a real image
// ============================================
if (location.search.includes('slots')) document.documentElement.classList.add('show-slots');

// ============================================
// SIDEBAR: contact details toggle on small screens
// ============================================
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
sidebarBtn.addEventListener('click', () => {
  const open = sidebar.classList.toggle('open');
  sidebarBtn.setAttribute('aria-expanded', open);
});

// ============================================
// SECTION TABS
// ============================================
const tabs = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.classList.toggle('active', t === tab));
  pages.forEach(p => p.classList.toggle('active', p.dataset.page === tab.dataset.navLink));
  window.scrollTo({ top: 0 });
}));

// ============================================
// PROJECT FILTER
// ============================================
const filterBtns = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');
const emptyNote = document.querySelector('[data-empty]');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  const value = btn.textContent.trim().toLowerCase();
  let shown = 0;
  filterBtns.forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-pressed', b === btn); });
  filterItems.forEach(item => {
    const match = value === 'all' || item.dataset.category === value;
    item.hidden = !match;
    if (match) shown++;
  });
  emptyNote.hidden = shown > 0;
}));

// ============================================
// CONTACT FORM (EmailJS)
// ============================================
const form = document.querySelector('[data-form]');
const formBtn = document.querySelector('[data-form-btn]');
const sendLabel = formBtn.textContent;

// Loads the EmailJS library if the page does not already include it, then initialises it
// Tried in order, so one blocked CDN does not stop the form
const EMAILJS_SOURCES = [
  'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js',
  'https://unpkg.com/@emailjs/browser@4/dist/email.min.js',
  'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js'
];
let emailjsLoading = null;

const addScript = (src) => new Promise((resolve, reject) => {
  const tag = document.createElement('script');
  tag.src = src;
  tag.onload = resolve;
  tag.onerror = () => { tag.remove(); reject(new Error('emailjs-load-failed')); };
  document.head.appendChild(tag);
});

const loadEmailJS = () => {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    return Promise.resolve();
  }
  if (!emailjsLoading) {
    emailjsLoading = (async () => {
      for (const src of EMAILJS_SOURCES) {
        try { await addScript(src); } catch (e) { continue; }
        if (typeof emailjs !== 'undefined') { emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY); return; }
      }
      emailjsLoading = null;
      throw new Error('emailjs-load-failed');
    })();
  }
  return emailjsLoading;
};
window.addEventListener('load', () => { loadEmailJS().catch(() => {}); });

// Status message under the form
const status = document.createElement('p');
status.setAttribute('role', 'status');
status.setAttribute('aria-live', 'polite');
status.hidden = true;
status.style.cssText = 'padding:12px 14px;border-radius:3px;font-size:.9rem;font-weight:500;border:1px solid';
form.after(status);

const showStatus = (text, type) => {
  const tones = {
    info:  ['#eef2f8', '#0e1b33', '#c9d3e4'],
    ok:    ['#eef6f0', '#1f6b3a', '#b9dcc5'],
    error: ['#fbeeee', '#9b2c2c', '#ecc3c3']
  }[type];
  status.textContent = text;
  status.style.background = tones[0];
  status.style.color = tones[1];
  status.style.borderColor = tones[2];
  status.hidden = false;
};

// Enable the send button only when the form is valid
form.addEventListener('input', () => { formBtn.disabled = !form.checkValidity(); });

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) { form.reportValidity(); return; }
  const data = new FormData(form);
  const name = data.get('fullname');
  const email = data.get('email');
  const message = data.get('message');

  // Both naming styles are sent, so the EmailJS template works with either
  const templateParams = {
    from_name: name, from_email: email, reply_to: email,
    fullname: name, email: email, name: name,
    message: message
  };

  formBtn.disabled = true;
  formBtn.textContent = 'Sending...';
  showStatus('Sending your message...', 'info');

  try {
    await loadEmailJS();
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    showStatus('Message sent. Thank you, I will reply soon.', 'ok');
    form.reset();
    setTimeout(() => { status.hidden = true; }, 10000);
  } catch (error) {
    console.error('EmailJS error:', error);
    let text = 'The message could not be sent. Please try again.';
    if (error && error.message === 'emailjs-load-failed') {
      text = 'The email service could not load. Please check your connection and try again.';
    } else if (error && (error.status === 403 || error.message === 'Failed to fetch')) {
      text = 'The message was blocked. Add this website\'s domain to the allowed list in EmailJS.';
    } else if (error && error.status === 422) {
      text = 'The recipient email is missing. Set "To Email" in your EmailJS template.';
    } else if (error && error.text) {
      text = error.text;
    }
    showStatus(text, 'error');
  } finally {
    formBtn.textContent = sendLabel;
    formBtn.disabled = !form.checkValidity();
  }
});