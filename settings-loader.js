function parseSettings(text) {
  const settings = {};

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const divider = line.indexOf(':');
    if (divider === -1) continue;

    const key = line.slice(0, divider).trim().toLowerCase();
    const value = line.slice(divider + 1).trim();
    if (key) settings[key] = value;
  }

  return settings;
}

function updateText(selector, value) {
  const element = document.querySelector(selector);
  if (!element || value == null || value === '') return;
  element.innerHTML = value;
}

function updatePlainText(selector, value) {
  const element = document.querySelector(selector);
  if (!element || value == null || value === '') return;
  element.textContent = value;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderDisclaimer(value) {
  return escapeHtml(value).replace(/cureduchenne\.org/gi, '<a href="https://cureduchenne.org" target="_blank" rel="noreferrer">cureduchenne.org</a>');
}

async function applySettings() {
  try {
    const response = await fetch('settings.txt', { cache: 'no-store' });
    if (!response.ok) return;

    const settings = parseSettings(await response.text());
    const donatedAmount = (settings['donated so far'] || '').replace(/^\$\s*/, '').trim();
    const carsRemoved = settings['cars removed'];

    updatePlainText('#donatedAmount', donatedAmount);
    updatePlainText('#carsRemoved', carsRemoved);

    if (settings['disclaimer']) {
      updateText('#disclaimerText', renderDisclaimer(settings['disclaimer']).replace(/\n/g, '<br>'));
    }

    if (settings['remove page title']) {
      updatePlainText('#removePageTitle', settings['remove page title']);
    }

    if (settings['remove page intro']) {
      updatePlainText('#removePageIntro', settings['remove page intro']);
    }

    if (settings['remove page note']) {
      updatePlainText('#removePageNote', settings['remove page note']);
    }

    if (settings['remove disclaimer']) {
      updateText('#removeDisclaimer', renderDisclaimer(settings['remove disclaimer']).replace(/\n/g, '<br>'));
    } else if (settings['disclaimer']) {
      updateText('#removeDisclaimer', renderDisclaimer(settings['disclaimer']).replace(/\n/g, '<br>'));
    }
  } catch (error) {
    console.warn('Could not load settings.txt', error);
  }
}

applySettings();