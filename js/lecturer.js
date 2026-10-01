/* Lecturer dashboard interactions, timer, history and settings. */
(function () {
  let timerId = null;
  let secondsRemaining = 300;

  function setMetricView(data) {
    document.querySelectorAll('[data-metric-understand]').forEach(el => el.textContent = data.understand + '%');
    document.querySelectorAll('[data-metric-unsure]').forEach(el => el.textContent = data.unsure + '%');
    document.querySelectorAll('[data-metric-stuck]').forEach(el => el.textContent = data.stuck + '%');
    document.querySelectorAll('[data-fill-understand]').forEach(el => el.style.width = data.understand + '%');
    document.querySelectorAll('[data-fill-unsure]').forEach(el => el.style.width = data.unsure + '%');
    document.querySelectorAll('[data-fill-stuck]').forEach(el => el.style.width = data.stuck + '%');
  }

  function currentPulseState() {
    const state = ClassPulse.getStoredJSON(ClassPulse.STORAGE_KEYS.intervention, { improved: false });
    return state.improved ? ClassPulse.SESSION_DATA.after : ClassPulse.SESSION_DATA.before;
  }

  function initMetrics() { setMetricView(currentPulseState()); }

  function formatTimer(seconds) {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }

  function updateTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    if (display) display.textContent = formatTimer(secondsRemaining);
  }

  function startTimer() {
    const button = document.getElementById('startTimerBtn');
    const status = document.getElementById('timerStatus');
    if (!button || !status || timerId) return;
    if (secondsRemaining <= 0) secondsRemaining = 300;
    status.textContent = 'Intervention in progress. Use this time for the peer discussion.';
    button.textContent = 'Intervention Running';
    button.disabled = true;
    timerId = window.setInterval(function () {
      secondsRemaining -= 1;
      updateTimerDisplay();
      if (secondsRemaining <= 0) {
        window.clearInterval(timerId);
        timerId = null;
        button.disabled = false;
        button.textContent = 'Start 5-Minute Intervention';
        status.textContent = 'Five minutes complete. Re-check the classroom pulse.';
        ClassPulse.showToast('Intervention complete. Re-check the classroom pulse.');
      }
    }, 1000);
  }

  function recheckPulse() {
    ClassPulse.setStoredJSON(ClassPulse.STORAGE_KEYS.intervention, { improved: true, recheckedAt: new Date().toISOString() });
    setMetricView(ClassPulse.SESSION_DATA.after);
    const success = document.getElementById('recheckSuccess');
    if (success) success.classList.add('show');
    const warning = document.querySelector('[data-current-warning]');
    if (warning) warning.textContent = 'Pulse improved after intervention';
    ClassPulse.showToast('New pulse received: understanding improved to 85%.');
  }

  function resetDemoPulse() {
    ClassPulse.setStoredJSON(ClassPulse.STORAGE_KEYS.intervention, { improved: false });
    setMetricView(ClassPulse.SESSION_DATA.before);
    ClassPulse.showToast('Live pulse reset to the starting demo values.');
  }

  function initLiveSession() {
    const resultsButton = document.getElementById('viewLiveResults');
    if (resultsButton) resultsButton.addEventListener('click', function () {
      document.getElementById('liveResults').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    const endSession = document.getElementById('endSessionBtn');
    if (endSession) endSession.addEventListener('click', function () {
      localStorage.setItem(ClassPulse.STORAGE_KEYS.sessionEnded, new Date().toISOString());
      ClassPulse.showToast('Session ended. Opening the session summary.');
      window.setTimeout(() => window.location.href = 'session-summary.html?id=arrays', 450);
    });
  }

  function initIntervention() {
    const start = document.getElementById('startTimerBtn');
    if (start) start.addEventListener('click', startTimer);
    const recheck = document.getElementById('recheckBtn');
    if (recheck) recheck.addEventListener('click', recheckPulse);
    updateTimerDisplay();
    initMetrics();
    const improved = ClassPulse.getStoredJSON(ClassPulse.STORAGE_KEYS.intervention, { improved: false }).improved;
    if (improved) {
      const success = document.getElementById('recheckSuccess');
      if (success) success.classList.add('show');
    }
  }

  function initHistory() {
    document.querySelectorAll('[data-summary-id]').forEach(button => {
      button.addEventListener('click', () => window.location.href = `session-summary.html?id=${encodeURIComponent(button.dataset.summaryId)}`);
    });
  }

  function initSummary() {
    const root = document.querySelector('[data-summary-page]');
    if (!root) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'arrays';
    const item = ClassPulse.HISTORY[id] || ClassPulse.HISTORY.arrays;
    document.getElementById('summaryModule').textContent = item.module;
    document.getElementById('summarySession').textContent = item.session;
    document.getElementById('summaryInitial').textContent = item.initial + '%';
    document.getElementById('summaryFinal').textContent = item.final + '%';
    document.getElementById('summaryIntervention').textContent = item.intervention;
    document.getElementById('summaryImprovement').textContent = '+' + item.improvement + '%';
    document.getElementById('summaryOutcome').textContent = item.outcome;
    document.getElementById('summaryNote').textContent = item.note;
    const timeline = document.getElementById('summaryTimeline');
    timeline.innerHTML = '';
    item.timeline.forEach(([time, copy]) => {
      const row = document.createElement('div');
      row.className = 'timeline-item';
      row.innerHTML = `<div class="timeline-time">${time}</div><div class="timeline-dot" aria-hidden="true"></div><div class="timeline-copy">${copy}</div>`;
      timeline.appendChild(row);
    });
    const reuse = document.getElementById('reuseIntervention');
    if (reuse) reuse.addEventListener('click', function () {
      ClassPulse.setStoredJSON(ClassPulse.STORAGE_KEYS.intervention, { improved: false });
      window.location.href = 'intervention.html';
    });
  }

  function initSettings() {
    const form = document.getElementById('settingsForm');
    if (!form) return;
    const saved = ClassPulse.getStoredJSON(ClassPulse.STORAGE_KEYS.settings, ClassPulse.DEFAULT_SETTINGS);
    const early = document.getElementById('earlyWarningAlerts');
    const privacy = document.getElementById('aggregatePrivacyMode');
    const sound = document.getElementById('soundNotifications');
    const message = document.getElementById('settingsMessage');

    function load(values) {
      early.checked = values.earlyWarningAlerts;
      privacy.checked = values.aggregatePrivacyMode;
      sound.checked = values.soundNotifications;
    }
    load(saved);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      ClassPulse.setStoredJSON(ClassPulse.STORAGE_KEYS.settings, {
        earlyWarningAlerts: early.checked,
        aggregatePrivacyMode: privacy.checked,
        soundNotifications: sound.checked
      });
      message.textContent = 'Settings saved successfully.';
      ClassPulse.showToast('Settings saved.');
    });

    document.getElementById('resetSettings').addEventListener('click', function () {
      load(ClassPulse.DEFAULT_SETTINGS);
      ClassPulse.setStoredJSON(ClassPulse.STORAGE_KEYS.settings, ClassPulse.DEFAULT_SETTINGS);
      message.textContent = 'Default settings restored.';
      ClassPulse.showToast('Default settings restored.');
    });
  }

  function initDashboardActions() {
    const reset = document.getElementById('resetDemoPulse');
    if (reset) reset.addEventListener('click', resetDemoPulse);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMetrics();
    initDashboardActions();
    initLiveSession();
    initIntervention();
    initHistory();
    initSummary();
    initSettings();
  });
})();
