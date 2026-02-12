const app = document.getElementById('app');
const hitCounter = document.getElementById('hitCounter');

const routeAliases = {
  '#/': { page: 'home', title: 'Home' },
  '#/home-ish': { page: 'home', title: 'Home-ish' },
  '#/thing': { page: 'register', title: 'Thing Registration Center' },
  '#/stuff': { page: 'register', title: 'Stuff Signup Unit' },
  '#/go': { page: 'help', title: 'Go To Help-ish' },
  '#/more': { page: 'settings', title: 'More Settings' },
  '#/maybe': { page: 'credits', title: 'Maybe Credits' },
  '#/register': { page: 'register', title: 'Register' },
  '#/help': { page: 'help', title: 'Help Center' },
  '#/settings': { page: 'settings', title: 'Settings' },
  '#/credits': { page: 'credits', title: 'Credits' },
  '#/confirmation': { page: 'confirmation', title: 'Thank You???' },
};

const registrationFields = [
  'firstName', 'lastName', 'email', 'phone', 'age',
  'country', 'city', 'zip', 'favoriteColor', 'leastFavoriteColor',
  'petName', 'school', 'jobTitle', 'hobby', 'motto',
  'website', 'emergencyContact', 'secretWord', 'shoeSize', 'timezone',
];

const placeholders = {
  firstName: 'type something first-ish',
  lastName: 'last-ish word',
  email: 'email maybe',
  phone: 'phone numbers only maybe',
  age: 'how old???',
  country: 'country-ish',
  city: 'city zone',
  zip: 'zip thing',
  favoriteColor: 'fav color but not really',
  leastFavoriteColor: 'worst color ever',
  petName: 'pet alias',
  school: 'school label',
  jobTitle: 'job title-ish',
  hobby: 'hobby maybe',
  motto: 'life motto now',
  website: 'website url but not checked',
  emergencyContact: 'call this maybe',
  secretWord: 'super secret word',
  shoeSize: 'shoe number',
  timezone: 'timezone text',
};

function initCounter() {
  const current = Number(localStorage.getItem('awfulHits') || '0') + 1;
  localStorage.setItem('awfulHits', String(current));
  hitCounter.textContent = `Hits: ${String(current).padStart(6, '0')}`;
}

function saveRegistration(payload) {
  const existing = JSON.parse(localStorage.getItem('registrations') || '[]');
  existing.push({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...payload,
  });
  localStorage.setItem('registrations', JSON.stringify(existing));
}

function renderHome(title) {
  app.innerHTML = `
    <h2>${title}</h2>
    <section class="wonky-grid">
      <article class="card">
        <h3>Welcome to confusion!</h3>
        <p>This portal is proudly hard to use. Please click random things.</p>
      </article>
      <article class="card" style="margin-top:37px;">
        <h4>Quick links that are not quick</h4>
        <ul>
          <li><a href="#/thing">Register Now-ish</a></li>
          <li><a href="#/go">Get Help but not really</a></li>
          <li><a href="#/more">Twist settings</a></li>
        </ul>
      </article>
    </section>
    <div class="marquee"><span>Bad UX Alert • flashing confusion • totally functional though • please enjoy the discomfort •</span></div>
  `;
}

function renderRegister(title) {
  const fieldsHtml = registrationFields
    .map((field) => `<input name="${field}" placeholder="${placeholders[field]}" required />`)
    .join('');

  app.innerHTML = `
    <h2>${title}</h2>
    <p>All fields are required and none are explained.</p>
    <div id="errorSummary"></div>
    <form id="registerForm" class="register-form" novalidate>
      ${fieldsHtml}
      <button type="submit">Submit Definitely</button>
    </form>
  `;

  const form = document.getElementById('registerForm');
  const errorSummary = document.getElementById('errorSummary');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {};
    registrationFields.forEach((key) => {
      payload[key] = String(formData.get(key) || '').trim();
    });

    const invalidCount = registrationFields.filter((field) => !payload[field]).length;

    if (invalidCount > 0) {
      errorSummary.innerHTML = `<div class="error-summary">Invalid. Try again. (${invalidCount} mysterious problems)</div>`;
      return;
    }

    saveRegistration(payload);
    localStorage.setItem('lastSubmissionName', payload.firstName || 'Anonymous');
    window.location.hash = '#/confirmation';
  });
}

function renderHelp(title) {
  const faqs = Array.from({ length: 8 }, (_, idx) => `
    <details class="faq-item">
      <summary>FAQ ${idx + 1}: Why is this here?</summary>
      <p>We are not sure. Please refresh and hope for different vibes.</p>
    </details>
  `).join('');

  app.innerHTML = `
    <h2>${title}</h2>
    <section class="help-search">
      <input type="search" placeholder="Search for help that won't help" />
      <p>No results found.</p>
    </section>
    <section>
      <h3>Frequently Avoided Questions</h3>
      ${faqs}
    </section>
  `;
}

function renderSettings(title) {
  app.innerHTML = `
    <h2>${title}</h2>
    <section class="settings-grid">
      <div class="setting-item" title="Changes your favorite sandwich">
        <label>
          <input type="checkbox" /> Enable disable mode
        </label>
      </div>
      <div class="setting-item" title="Probably adjusts moon brightness">
        <label>
          <input type="checkbox" /> Turn off on
        </label>
      </div>
      <div class="setting-item" title="Deletes absolutely nothing maybe">
        <p>Yes / Yes:</p>
        <label><input type="radio" name="yesyes" checked /> Yes</label>
        <label><input type="radio" name="yesyes" /> Yes</label>
      </div>
      <button type="button">Save Unclear Preferences</button>
    </section>
  `;
}

function renderCredits(title) {
  const longList = Array.from({ length: 120 }, (_, i) => `<li>Contributor ${i + 1} ${['🫠', '🐸', '🚀', '🍕', '👾'][i % 5]}</li>`).join('');

  app.innerHTML = `
    <h2>${title}</h2>
    <p>Please scroll forever to find nobody you know.</p>
    <ol class="credits-wall">${longList}</ol>
  `;
}

function renderConfirmation(title) {
  const last = localStorage.getItem('lastSubmissionName') || 'Mystery Person';
  app.innerHTML = `
    <h2>${title}</h2>
    <div class="success-warning">
      ⚠️ Thank you, ${last}. You may have failed successfully. ⚠️
    </div>
    <p><a href="#/home-ish">Return to Home-ish</a></p>
  `;
}

function renderNotFound() {
  app.innerHTML = `
    <section class="not-found">
      <h2>404-ish Not Found</h2>
      <p>This page is definitely somewhere else.</p>
      <p><a href="#/home-ish">Try Home-ish</a></p>
    </section>
  `;
}

function router() {
  const hash = window.location.hash || '#/';
  const route = routeAliases[hash];

  if (!route) {
    document.title = 'Lost in Portal';
    renderNotFound();
    return;
  }

  document.title = `${route.title} | Worst Website Challenge Portal`;

  switch (route.page) {
    case 'home':
      renderHome(route.title);
      break;
    case 'register':
      renderRegister(route.title);
      break;
    case 'help':
      renderHelp(route.title);
      break;
    case 'settings':
      renderSettings(route.title);
      break;
    case 'credits':
      renderCredits(route.title);
      break;
    case 'confirmation':
      renderConfirmation(route.title);
      break;
    default:
      renderNotFound();
  }
}

initCounter();
window.addEventListener('hashchange', router);
router();
