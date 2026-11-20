// Keep the language switch in the contents aligned with the chapter being read.
const chapters = [...document.querySelectorAll('[data-chapter]')];
const switches = [...document.querySelectorAll('[data-reader-language]')].map(link => ({
  link,
  edition: new URL(link.href),
}));

function updateLanguageLinks() {
  const threshold = Math.min(160, window.innerHeight / 3);
  const current = chapters.filter(chapter => chapter.getBoundingClientRect().top <= threshold).pop();
  for (const { link, edition } of switches) {
    edition.hash = current?.id || '';
    link.href = edition.href;
  }
}

let queued = false;
function scheduleUpdate() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    updateLanguageLinks();
  });
}

window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('pageshow', scheduleUpdate);
window.addEventListener('hashchange', scheduleUpdate);
updateLanguageLinks();
