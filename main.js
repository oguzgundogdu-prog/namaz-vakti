// DOM Elements
const locationNameEl = document.getElementById('location-name');
const dateDisplayEl = document.getElementById('date-display');
const nextPrayerNameEl = document.getElementById('next-prayer-name');
const countdownEl = document.getElementById('countdown');
const prayerTimesListEl = document.getElementById('prayer-times-list');
const notificationToggleEl = document.getElementById('notification-toggle');

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

// Make PRAYER_NAMES_TR available globally for notifications.js
window.PRAYER_NAMES_TR = PRAYER_NAMES_TR;

const ORDERED_PRAYERS = ['Tahajjud', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// State
let prayerData = null;
let nextPrayerTime = null;
let countdownInterval = null;
let prayerNotifications = null;

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

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

async function getLocationName(lat, lng) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=tr`);
    const data = await response.json();

    if (data.address) {
      const city = data.address.city || data.address.town || data.address.state || data.address.province;
      if (city) {
        locationNameEl.textContent = city;
      }
    }
  } catch (error) {
    console.error('Konum adı alınamadı:', error);
    // Konum adı alınamazsa sadece varsayılan kalır
  }
}

function updateDateDisplay() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateDisplayEl.textContent = new Date().toLocaleDateString('tr-TR', options);
}

async function fetchPrayerTimes(lat, lng) {
  try {
    const date = Math.floor(Date.now() / 1000); // Unix timestamp
    const response = await fetch(`${API_URL}/${date}?latitude=${lat}&longitude=${lng}&method=${CALCULATION_METHOD}`);
    const data = await response.json();

    if (data.code === 200) {
      prayerData = data.data;
      calculateTahajjud();
      renderPrayerTimes();
      setupCountdown();

      // Location name will be updated by getLocationName function
    } else {
      throw new Error('API Error');
    }
  } catch (error) {
    console.error('Veri çekme hatası:', error);
    prayerTimesListEl.innerHTML = '<div class="loading-spinner">Veri çekilemedi. Lütfen sayfayı yenileyin.</div>';
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
  prayerTimesListEl.innerHTML = '';
  const timings = prayerData.timings;

  ORDERED_PRAYERS.forEach(key => {
    const time = timings[key];
    const trName = PRAYER_NAMES_TR[key];

    const div = document.createElement('div');
    div.className = 'prayer-item';
    div.dataset.key = key; // for highlighting later

    div.innerHTML = `
      <span class="prayer-name">${trName}</span>
      <span class="prayer-time">${time}</span>
    `;

    prayerTimesListEl.appendChild(div);
  });
}

function setupCountdown() {
  updateNextPrayer();
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(updateNextPrayer, 1000);
}

function updateNextPrayer() {
  if (!prayerData) return;

  const now = new Date();
  const timings = prayerData.timings;
  let nextPrayer = null;
  let minDiff = Infinity;
  let nextPrayerKey = '';

  // Check today's prayers
  for (const key of ORDERED_PRAYERS) {
    const timeStr = timings[key];
    const [hours, minutes] = timeStr.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);

    if (prayerDate > now) {
      const diff = prayerDate - now;
      if (diff < minDiff) {
        minDiff = diff;
        nextPrayer = prayerDate;
        nextPrayerKey = key;
      }
    }
  }

  // If no prayer left today, next is Fajr of tomorrow
  let isTomorrow = false;
  if (!nextPrayer) {
    const timeStr = timings['Fajr'];
    const [hours, minutes] = timeStr.split(':').map(Number);
    nextPrayer = new Date();
    nextPrayer.setDate(nextPrayer.getDate() + 1);
    nextPrayer.setHours(hours, minutes, 0, 0);
    nextPrayerKey = 'Fajr';
    isTomorrow = true;
  }

  // Update DOM
  const timeDiff = nextPrayer - new Date();

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

  // Highlight active/next prayer
  document.querySelectorAll('.prayer-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.key === nextPrayerKey) {
      item.classList.add('active');
    }
  });
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

// Initialize notifications
function initNotifications() {
  if (typeof window.PrayerNotifications === 'undefined') {
    console.warn('PrayerNotifications not loaded yet');
    return;
  }

  prayerNotifications = new window.PrayerNotifications();

  // Update notification button state
  updateNotificationButton();

  // Notification toggle button
  notificationToggleEl.addEventListener('click', async () => {
    if (prayerNotifications.permission === 'granted' && prayerNotifications.settings.enabled) {
      // Disable notifications
      prayerNotifications.settings.enabled = false;
      prayerNotifications.saveSettings();
      prayerNotifications.stopChecking();
      updateNotificationButton();
    } else {
      // Request permission and enable
      const granted = await prayerNotifications.requestPermission();
      if (granted && prayerData) {
        prayerNotifications.startChecking(prayerData);
      }
      updateNotificationButton();
    }
  });

  // Start checking if enabled and we have data
  if (prayerNotifications.settings.enabled && prayerData) {
    prayerNotifications.startChecking(prayerData);
  }
}

function updateNotificationButton() {
  if (!prayerNotifications) return;

  if (prayerNotifications.permission === 'granted' && prayerNotifications.settings.enabled) {
    notificationToggleEl.classList.add('active');
    notificationToggleEl.title = 'Bildirimler Açık (Kapatmak için tıklayın)';
  } else {
    notificationToggleEl.classList.remove('active');
    notificationToggleEl.title = 'Bildirimler Kapalı (Açmak için tıklayın)';
  }
}

// Wait for PrayerNotifications to load, then initialize
window.addEventListener('load', () => {
  setTimeout(initNotifications, 100);
});

init();
