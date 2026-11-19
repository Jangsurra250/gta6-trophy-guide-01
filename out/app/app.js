// Leonida Trophy Guide & Tracker: loads the 55 trophies from data/trophies.json,
// renders the checklist, and keeps earned ticks in localStorage with export/import.
(function () {
  'use strict';

  var STORAGE_KEY = 'gta6-trophy-guide-progress-v1';
  var DATA_URL = 'data/trophies.json';

  var listEl = document.getElementById('trophyList');
  var emptyNote = document.getElementById('emptyNote');
  var countText = document.getElementById('countText');
  var progressText = document.getElementById('progressText');
  var progressPct = document.getElementById('progressPct');
  var progressFill = document.getElementById('progressFill');
  var progressNote = document.getElementById('progressNote');
  var searchBox = document.getElementById('searchBox');
  var kindFilter = document.getElementById('kindFilter');
  var gradeFilter = document.getElementById('gradeFilter');
  var stageFilter = document.getElementById('stageFilter');
  var earnedFilter = document.getElementById('earnedFilter');
  var spoilerToggle = document.getElementById('spoilerToggle');
  var exportBtn = document.getElementById('exportBtn');
  var importBtn = document.getElementById('importBtn');
  var importFile = document.getElementById('importFile');
  var resetBtn = document.getElementById('resetBtn');
  var statusLine = document.getElementById('statusLine');

  var trophies = [];
  var earned = loadProgress();

  function loadProgress() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(earned));
    } catch (e) {
      setStatus('Could not save progress in this browser.');
    }
  }

  function setStatus(message) {
    statusLine.textContent = message;
    if (message) {
      window.setTimeout(function () { statusLine.textContent = ''; }, 6000);
    }
  }

  function gradeLabel(grade) {
    return grade.charAt(0).toUpperCase() + grade.slice(1);
  }

  function kindLabel(kind) {
    if (kind === 'missable') return 'Missable';
    if (kind === 'collectibles') return 'Collectibles';
    if (kind === 'activities') return 'Activities';
    if (kind === 'story') return 'Story';
    if (kind === 'online') return 'Online';
    return kind;
  }

  function isSpoilerHidden(trophy) {
    return spoilerToggle.checked && trophy.kind === 'story' && !earned[trophy.name];
  }

  function trophyMatches(trophy) {
    var q = searchBox.value.trim().toLowerCase();
    if (q) {
      var hay = (trophy.name + ' ' + trophy.description + ' ' + trophy.guide).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    if (kindFilter.value !== 'all' && trophy.kind !== kindFilter.value) return false;
    if (gradeFilter.value !== 'all' && trophy.grade !== gradeFilter.value) return false;
    if (stageFilter.value !== 'all' && String(trophy.stage) !== stageFilter.value) return false;
    if (earnedFilter.value === 'earned' && !earned[trophy.name]) return false;
    if (earnedFilter.value === 'todo' && earned[trophy.name]) return false;
    return true;
  }

  function buildSourceList(trophy) {
    var wrap = document.createElement('p');
    wrap.className = 'sources';
    wrap.textContent = 'Sources: ';
    (trophy.sources || []).forEach(function (source, i) {
      if (i > 0) wrap.appendChild(document.createTextNode(' · '));
      var a = document.createElement('a');
      a.href = source.url;
      a.textContent = source.name;
      a.target = '_blank';
      a.rel = 'noopener';
      wrap.appendChild(a);
    });
    return wrap;
  }

  function buildTrophyCard(trophy) {
    var card = document.createElement('article');
    card.className = 'trophy-card grade-' + trophy.grade + (earned[trophy.name] ? ' is-earned' : '');
    if (trophy.missable) card.classList.add('is-missable');

    var head = document.createElement('div');
    head.className = 'card-head';

    var box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'earn-box';
    box.checked = !!earned[trophy.name];
    box.setAttribute('aria-label', 'Mark ' + trophy.name + ' as earned');
    box.addEventListener('change', function () {
      if (box.checked) earned[trophy.name] = true;
      else delete earned[trophy.name];
      saveProgress();
      render();
    });
    head.appendChild(box);

    var titles = document.createElement('div');
    titles.className = 'card-titles';
    var nameEl = document.createElement('h3');
    nameEl.className = 'trophy-name';
    nameEl.textContent = isSpoilerHidden(trophy)
      ? 'Hidden story trophy — earn it to reveal its name'
      : trophy.name;
    titles.appendChild(nameEl);
    var descEl = document.createElement('p');
    descEl.className = 'trophy-desc';
    descEl.textContent = isSpoilerHidden(trophy)
      ? 'Its name and description stay hidden until you earn it. (Spoiler setting is on.)'
      : trophy.description;
    titles.appendChild(descEl);
    head.appendChild(titles);

    var badge = document.createElement('span');
    badge.className = 'grade-badge grade-' + trophy.grade;
    badge.textContent = gradeLabel(trophy.grade);
    head.appendChild(badge);
    card.appendChild(head);

    var meta = document.createElement('p');
    meta.className = 'card-meta';
    var bits = [kindLabel(trophy.kind), 'Stage ' + trophy.stage];
    if (trophy.hidden) bits.push('Hidden on PS5 until earned');
    if (trophy.missable) bits.push('MISSABLE');
    meta.textContent = bits.join(' · ');
    card.appendChild(meta);

    if (trophy.missable) {
      var warn = document.createElement('p');
      warn.className = 'missable-flag';
      warn.textContent = 'Missable — see the guide below and do the Chapter 1 meditation before the chapter ends.';
      card.appendChild(warn);
    }

    var guide = document.createElement('p');
    guide.className = 'trophy-guide';
    guide.textContent = trophy.guide;
    card.appendChild(guide);
    card.appendChild(buildSourceList(trophy));
    return card;
  }

  function renderProgress() {
    var total = trophies.length;
    var done = trophies.filter(function (t) { return earned[t.name]; }).length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    progressText.textContent = done + ' / ' + total + ' earned';
    progressPct.textContent = pct + '%';
    progressFill.style.width = pct + '%';
    progressNote.textContent = done === total && total > 0
      ? 'Platinum earned — congratulations, Leonida Legend!'
      : done > 0
        ? done + ' down, ' + (total - done) + ' to go. The platinum pops when the last one is ticked.'
        : 'Tick a trophy when you earn it in-game. Your progress is saved in this browser only.';
  }

  function render() {
    renderProgress();
    listEl.innerHTML = '';
    var shown = trophies.filter(trophyMatches);
    shown.forEach(function (trophy) {
      listEl.appendChild(buildTrophyCard(trophy));
    });
    countText.textContent = '— showing ' + shown.length + ' of ' + trophies.length;
    emptyNote.hidden = shown.length !== 0;
  }

  function exportProgress() {
    var payload = {
      app: 'gta6-trophy-guide-01',
      exportedAt: new Date().toISOString(),
      earned: Object.keys(earned).sort()
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'gta6-trophy-progress.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    setStatus('Progress exported (' + payload.earned.length + ' earned).');
  }

  function importProgressFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(String(reader.result));
        var names = Array.isArray(parsed) ? parsed : parsed.earned;
        if (!Array.isArray(names)) throw new Error('bad file');
        var known = {};
        trophies.forEach(function (t) { known[t.name] = true; });
        var next = {};
        var imported = 0;
        var skipped = 0;
        names.forEach(function (name) {
          if (known[name]) { next[name] = true; imported += 1; }
          else { skipped += 1; }
        });
        earned = next;
        saveProgress();
        render();
        setStatus('Imported ' + imported + ' earned trophies' + (skipped ? ' (' + skipped + ' unknown names skipped)' : '') + '.');
      } catch (e) {
        setStatus('That file is not a progress export from this guide.');
      }
    };
    reader.onerror = function () {
      setStatus('Could not read that file.');
    };
    reader.readAsText(file);
  }

  [searchBox, kindFilter, gradeFilter, stageFilter, earnedFilter, spoilerToggle].forEach(function (el) {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
  exportBtn.addEventListener('click', exportProgress);
  importBtn.addEventListener('click', function () { importFile.click(); });
  importFile.addEventListener('change', function () {
    if (importFile.files && importFile.files[0]) importProgressFile(importFile.files[0]);
    importFile.value = '';
  });
  resetBtn.addEventListener('click', function () {
    if (window.confirm('Clear all earned ticks? This cannot be undone. Export first if you want a backup.')) {
      earned = {};
      saveProgress();
      render();
      setStatus('Progress cleared.');
    }
  });

  fetch(DATA_URL)
    .then(function (response) {
      if (!response.ok) throw new Error('trophies.json did not load');
      return response.json();
    })
    .then(function (doc) {
      trophies = doc.trophies || [];
      render();
    })
    .catch(function () {
      listEl.innerHTML = '';
      emptyNote.hidden = false;
      emptyNote.textContent = 'Could not load the trophy list (data/trophies.json). Serve app/ over HTTP — for example, run node serve.ts — and reload.';
    });
})();
