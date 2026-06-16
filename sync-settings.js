const fs = require('fs');
const path = require('path');

const root = __dirname;

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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderDisclaimer(value) {
  const escaped = escapeHtml(value);
  return escaped.replace(
    /cureduchenne\.org/gi,
    '<a href="https://cureduchenne.org" target="_blank" rel="noreferrer">cureduchenne.org</a>'
  );
}

function writeFile(fileName, content) {
  fs.writeFileSync(path.join(root, fileName), content, 'utf8');
}

const settings = parseSettings(fs.readFileSync(path.join(root, 'settings.txt'), 'utf8'));
const donatedAmount = (settings['donated so far'] || '$12,480.00').replace(/^\$\s*/, '').trim();
const carsRemoved = settings['cars removed'] || '86';
const removePageTitle = settings['remove page title'] || 'Tell us about the vehicle and where it is located.';
const removePageIntro = settings['remove page intro'] || "Free pickup depends on the car's location. Share the details below so we can confirm availability, estimate the pickup, and move quickly.";
const removePageNote = settings['remove page note'] || 'Use the condition and drivability fields to help us understand whether the car starts, drives, or needs towing.';
const disclaimer = settings['disclaimer'] || 'We are not affiliated with CureDuchenne or any partner organization. Please also consider making an independent donation directly to cureduchenne.org. We chose CureDuchenne because this disease has affected our family closely.';

let indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
indexHtml = indexHtml.replace(/<span class="counter-value" id="donatedAmount">[\s\S]*?<\/span>/, `<span class="counter-value" id="donatedAmount">${escapeHtml(donatedAmount)}</span>`);
indexHtml = indexHtml.replace(/<span id="carsRemoved">[\s\S]*?<\/span>/, `<span id="carsRemoved">${escapeHtml(carsRemoved)}</span>`);
indexHtml = indexHtml.replace(/<p id="disclaimerText">[\s\S]*?<\/p>/, `<p id="disclaimerText">${renderDisclaimer(disclaimer)}</p>`);
writeFile('index.html', indexHtml);

let removeHtml = fs.readFileSync(path.join(root, 'remove.html'), 'utf8');
removeHtml = removeHtml.replace(/<h1 id="removePageTitle">[\s\S]*?<\/h1>/, `<h1 id="removePageTitle">${escapeHtml(removePageTitle)}</h1>`);
removeHtml = removeHtml.replace(/<p class="lede" id="removePageIntro">[\s\S]*?<\/p>/, `<p class="lede" id="removePageIntro">${escapeHtml(removePageIntro)}</p>`);
removeHtml = removeHtml.replace(/<p class="card-note card-note--light" id="removePageNote">[\s\S]*?<\/p>/, `<p class="card-note card-note--light" id="removePageNote">${escapeHtml(removePageNote)}</p>`);
removeHtml = removeHtml.replace(/<p class="disclaimer" id="removeDisclaimer">[\s\S]*?<\/p>/, `<p class="disclaimer" id="removeDisclaimer">${renderDisclaimer(disclaimer).replace(/\n/g, '<br>')}</p>`);
writeFile('remove.html', removeHtml);

console.log('Synced index.html and remove.html from settings.txt');