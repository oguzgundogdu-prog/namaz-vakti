// DOM Elements
const locationNameEl = document.getElementById('location-name');
const dateDisplayEl = document.getElementById('date-display');
const nextPrayerNameEl = document.getElementById('next-prayer-name');
const countdownEl = document.getElementById('countdown');
const prayerTimesListEl = document.getElementById('prayer-times-list');
const nafileListEl = document.getElementById('nafile-list');

// Configuration
const API_URL = 'https://api.aladhan.com/v1/timings';
const CALCULATION_METHOD = 13; // Diyanet İşleri Başkanlığı
const PRAYER_NAMES_TR = {
  Tahajjud: 'Teheccüd',
  Fajr: 'İmsak',
  Sunrise: 'Güneş',
  Dhuhr: 'Öğle',
  Asr: 'İkindi',
  Maghrib: 'Akşam',
  Isha: 'Yatsı'
};

const ORDERED_PRAYERS = ['Tahajjud', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// State
let prayerData = null;
let nextPrayerTime = null;
let countdownInterval = null;
let nafileTimes = {};

// Initialize
async function init() {
  updateDateDisplay();

  try {
    const position = await getPosition();
    const { latitude, longitude } = position.coords;
    await fetchPrayerTimes(latitude, longitude);
    await getLocationName(latitude, longitude);
  } catch (error) {
    console.error('Konum hatası:', error);
    locationNameEl.textContent = 'İstanbul';
    // Fallback to Istanbul coordinates
    await fetchPrayerTimes(41.0082, 28.9784);
  }
}

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
}

async function getLocationName(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=tr`
    );
    const data = await response.json();

    if (data && data.address) {
      const city = data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.state ||
        'İstanbul';
      locationNameEl.textContent = city;
    }
  } catch (error) {
    console.error('Konum ismi alınamadı:', error);
    // Keep default or existing location name
  }
}

async function fetchPrayerTimes(latitude, longitude) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const url = `${API_URL}/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${CALCULATION_METHOD}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 200) {
      prayerData = data.data;
      calculateTahajjud();
      calculateNafileTimes();
      renderPrayerTimes();
      renderNafilePrayers();
      setupCountdown();

      // Location name will be updated by getLocationName function
    } else {
      throw new Error('API error');
    }
  } catch (error) {
    console.error('Namaz vakitleri alınamadı:', error);
    prayerTimesListEl.innerHTML = '<p style="text-align:center;">Veriler yüklenemedi. Lütfen tekrar deneyin.</p>';
  }
}

function calculateTahajjud() {
  if (!prayerData || !prayerData.timings) return;

  // Get Fajr (İmsak) time
  const fajrTime = prayerData.timings.Fajr;
  const [hours, minutes] = fajrTime.split(':').map(Number);

  // Calculate Tahajjud: 60 minutes before Fajr
  const fajrDate = new Date();
  fajrDate.setHours(hours, minutes, 0, 0);

  const tahajjudDate = new Date(fajrDate.getTime() - 60 * 60 * 1000); // Subtract 60 minutes

  // Format as HH:MM
  const tahajjudHours = tahajjudDate.getHours().toString().padStart(2, '0');
  const tahajjudMinutes = tahajjudDate.getMinutes().toString().padStart(2, '0');

  // Add Tahajjud to timings
  prayerData.timings.Tahajjud = `${tahajjudHours}:${tahajjudMinutes}`;
}

function renderPrayerTimes() {
  if (!prayerData) return;

  const timings = prayerData.timings;
  const now = new Date();

  prayerTimesListEl.innerHTML = ORDERED_PRAYERS.map((prayer) => {
    const timeStr = timings[prayer];
    const [hours, minutes] = timeStr.split(':').map(Number);

    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);

    const isPast = prayerTime < now;

    return `
      <div class="prayer-item ${isPast ? 'past' : ''}" data-prayer="${prayer}">
        <span class="prayer-name">${PRAYER_NAMES_TR[prayer]}</span>
        <span class="prayer-time">${timeStr}</span>
      </div>
    `;
  }).join('');
}

function setupCountdown() {
  if (!prayerData) return;

  const timings = prayerData.timings;
  const now = new Date();

  // Find next prayer
  let nextPrayer = null;
  let isTomorrow = false;

  for (const prayer of ORDERED_PRAYERS) {
    const timeStr = timings[prayer];
    const [hours, minutes] = timeStr.split(':').map(Number);

    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);

    if (prayerTime > now) {
      nextPrayer = { key: prayer, time: prayerTime };
      break;
    }
  }

  // If no prayer found for today, next is first prayer tomorrow
  if (!nextPrayer) {
    const firstPrayer = ORDERED_PRAYERS[0];
    const timeStr = timings[firstPrayer];
    const [hours, minutes] = timeStr.split(':').map(Number);

    const prayerTime = new Date();
    prayerTime.setDate(prayerTime.getDate() + 1);
    prayerTime.setHours(hours, minutes, 0, 0);

    nextPrayer = { key: firstPrayer, time: prayerTime };
    isTomorrow = true;
  }

  nextPrayerTime = nextPrayer.time;

  // Highlight next prayer
  document.querySelectorAll('.prayer-item').forEach(item => {
    if (item.dataset.prayer === nextPrayer.key && !isTomorrow) {
      item.classList.add('active');
    }
  });

  // Update countdown
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  updateCountdown(nextPrayer.key, isTomorrow);
  countdownInterval = setInterval(() => updateCountdown(nextPrayer.key, isTomorrow), 1000);
}

function updateCountdown(nextPrayerKey, isTomorrow) {
  const now = new Date();
  const timeDiff = nextPrayerTime - now;

  if (timeDiff < 0) {
    // Should re-run logic if time passed during interval
    // For now simple reload trigger or re-calc
    setupCountdown();
    return;
  }

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  countdownEl.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  const nextName = PRAYER_NAMES_TR[nextPrayerKey];
  nextPrayerNameEl.textContent = isTomorrow ? `${nextName} (Yarın)` : nextName;
}

function updateDateDisplay() {
  const now = new Date();
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const dateStr = now.toLocaleDateString('tr-TR', options);
  dateDisplayEl.textContent = dateStr;
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

// Tab Switching
function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  if (!buttons || buttons.length === 0) {
    console.warn('Tab buttons not found');
    return;
  }

  buttons.forEach(button => {
    button.addEventListener('click', function () {
      const tabName = this.getAttribute('data-tab');

      // Remove active from all
      buttons.forEach(btn => btn.classList.remove('active'));
      contents.forEach(content => content.classList.remove('active'));

      // Add active to clicked
      this.classList.add('active');
      const target = document.getElementById(tabName + '-content');
      if (target) {
        target.classList.add('active');
      }
    });
  });
}

// Calculate Nafile Prayer Times
function calculateNafileTimes() {
  if (!prayerData || !prayerData.timings) return;

  const timings = prayerData.timings;

  // İşrak: 15-20 dakika after sunrise
  const sunriseTime = parseTime(timings.Sunrise);
  const israkTime = new Date(sunriseTime.getTime() + 20 * 60 * 1000);

  // Kuşluk: Fixed time 10:30
  const kuslukTime = new Date();
  kuslukTime.setHours(10, 30, 0, 0);

  // Evvabin: Between Maghrib and Isha (Maghrib + 15 mins)
  const maghribTime = parseTime(timings.Maghrib);
  const evvabinTime = new Date(maghribTime.getTime() + 15 * 60 * 1000);

  nafileTimes = {
    israk: formatTime(israkTime),
    kusluk: formatTime(kuslukTime),
    evvabin: formatTime(evvabinTime)
  };
}

// Parse time string to Date object
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Format Date object to HH:MM
function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Render Nafile Prayers
function renderNafilePrayers() {
  const nafileData = [
    { id: 'teheccud', name: 'Teheccüd', time: prayerData?.timings?.Tahajjud || '--:--', description: 'İmsak\'tan 1 saat önce' },
    { id: 'israk', name: 'İşrak', time: nafileTimes.israk, description: 'Güneş doğduktan 20 dk sonra' },
    { id: 'kusluk', name: 'Kuşluk', time: nafileTimes.kusluk, description: 'Sabah ortası' },
    { id: 'evvabin', name: 'Evvabin', time: nafileTimes.evvabin, description: 'Akşam-Yatsı arası' }
  ];

  const checkboxStates = loadCheckboxStates();

  nafileListEl.innerHTML = nafileData.map(prayer => {
    const isChecked = checkboxStates[prayer.id] || false;
    const completedClass = isChecked ? 'completed' : '';

    return `
      <div class="nafile-item ${completedClass}" data-prayer-id="${prayer.id}">
        <div class="nafile-item-info">
          <div class="nafile-name">${prayer.name}</div>
          <div class="nafile-time">${prayer.time} - ${prayer.description}</div>
        </div>
        <label class="nafile-checkbox">
          <input type="checkbox" id="nafile-${prayer.id}" name="nafile-${prayer.id}" ${isChecked ? 'checked' : ''} onchange="handleNafileCheckbox('${prayer.id}', this.checked)">
          <span class="checkbox-custom"></span>
        </label>
      </div>
    `;
  }).join('');
}

// Handle Checkbox Change
function handleNafileCheckbox(prayerId, isChecked) {
  saveCheckboxState(prayerId, isChecked);

  const item = document.querySelector(`[data-prayer-id="${prayerId}"]`);
  if (isChecked) {
    item.classList.add('completed');
  } else {
    item.classList.remove('completed');
  }
}

// Save Checkbox State to localStorage
function saveCheckboxState(prayerId, isChecked) {
  const states = loadCheckboxStates();
  states[prayerId] = isChecked;
  localStorage.setItem('nafileCheckboxes', JSON.stringify(states));
}

// Load Checkbox States from localStorage
function loadCheckboxStates() {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('nafileCheckboxes');
  const storedDate = localStorage.getItem('nafileCheckboxesDate');

  // Reset if new day
  if (storedDate !== today) {
    localStorage.setItem('nafileCheckboxesDate', today);
    localStorage.removeItem('nafileCheckboxes');
    return {};
  }

  return stored ? JSON.parse(stored) : {};
}

// Make handleNafileCheckbox global for onclick attribute
window.handleNafileCheckbox = handleNafileCheckbox;

// Make handleNafileCheckbox global for onclick attribute
window.handleNafileCheckbox = handleNafileCheckbox;

// Initialize app after all functions are defined
initTabs();
init();
