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

const ORDERED_PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

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
    // Save coordinates for sidebar calendar
    userCoordinates = { latitude, longitude };
    await fetchPrayerTimes(latitude, longitude);
    await getLocationName(latitude, longitude);
  } catch (error) {
    console.error('Konum hatası:', error);
    locationNameEl.textContent = 'İstanbul';
    // Fallback to Istanbul coordinates
    userCoordinates = { latitude: 41.0082, longitude: 28.9784 };
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

// ============================================
// Settings Sidebar
// ============================================

// Sidebar State
let currentCalendarMonth = new Date().getMonth(); // 0-11
let currentCalendarYear = new Date().getFullYear();
let calendarData = null;
let userCoordinates = { latitude: 41.0082, longitude: 28.9784 }; // Default Istanbul

// Sidebar Elements
const settingsBtn = document.getElementById('settings-btn');
const sidebar = document.getElementById('settings-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const sidebarTabBtns = document.querySelectorAll('.sidebar-tab-btn');
const prevMonthBtn = document.getElementById('prev-month-btn');
const nextMonthBtn = document.getElementById('next-month-btn');
const currentMonthDisplay = document.getElementById('current-month-display');
const calendarTbody = document.getElementById('calendar-tbody');
const quotesList = document.getElementById('quotes-list');

// Open Sidebar
function openSidebar() {
  sidebar.classList.add('active');
  sidebarOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close Sidebar
function closeSidebar() {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Event Listeners
if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    openSidebar();
    // Load calendar on first open
    if (!calendarData) {
      fetchMonthlyCalendar(currentCalendarYear, currentCalendarMonth + 1);
    }
    // Load quotes on first open
    if (quotesList && quotesList.children.length === 0) {
      renderQuotes();
    }
  });
}

if (sidebarCloseBtn) {
  sidebarCloseBtn.addEventListener('click', closeSidebar);
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', closeSidebar);
}

// Sidebar Tab Switching
sidebarTabBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    const tabName = this.getAttribute('data-sidebar-tab');

    // Remove active from all
    sidebarTabBtns.forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sidebar-tab-content').forEach(content => {
      content.classList.remove('active');
    });

    // Add active to clicked
    this.classList.add('active');
    const targetContent = document.getElementById(tabName + '-content');
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
});

// Month Navigation
if (prevMonthBtn) {
  prevMonthBtn.addEventListener('click', () => {
    currentCalendarMonth--;
    if (currentCalendarMonth < 0) {
      currentCalendarMonth = 11;
      currentCalendarYear--;
    }
    fetchMonthlyCalendar(currentCalendarYear, currentCalendarMonth + 1);
  });
}

if (nextMonthBtn) {
  nextMonthBtn.addEventListener('click', () => {
    currentCalendarMonth++;
    if (currentCalendarMonth > 11) {
      currentCalendarMonth = 0;
      currentCalendarYear++;
    }
    fetchMonthlyCalendar(currentCalendarYear, currentCalendarMonth + 1);
  });
}

// Fetch Monthly Calendar
async function fetchMonthlyCalendar(year, month) {
  try {
    const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${userCoordinates.latitude}&longitude=${userCoordinates.longitude}&method=${CALCULATION_METHOD}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 200 && data.data) {
      calendarData = data.data;
      renderCalendar();
      updateMonthDisplay();
    } else {
      throw new Error('Calendar API error');
    }
  } catch (error) {
    console.error('Aylık takvim yüklenemedi:', error);
    if (calendarTbody) {
      calendarTbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">Takvim yüklenemedi</td></tr>';
    }
  }
}

// Clean time format (remove timezone like +03:00)
function cleanTime(timeStr) {
  if (!timeStr) return '--:--';
  // Remove everything after space (like " (UTC+3)" or " +03:00")
  return timeStr.split(' ')[0];
}

// Render Calendar Table
function renderCalendar() {
  if (!calendarData || !calendarTbody) return;

  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const isCurrentMonth = currentCalendarMonth === todayMonth && currentCalendarYear === todayYear;

  calendarTbody.innerHTML = calendarData.map((dayData, index) => {
    const timings = dayData.timings;
    const day = index + 1;
    const isToday = isCurrentMonth && day === todayDay;

    return `
      <tr class="${isToday ? 'today' : ''}">
        <td>${day}</td>
        <td>${cleanTime(timings.Fajr)}</td>
        <td>${cleanTime(timings.Sunrise)}</td>
        <td>${cleanTime(timings.Dhuhr)}</td>
        <td>${cleanTime(timings.Asr)}</td>
        <td>${cleanTime(timings.Maghrib)}</td>
        <td>${cleanTime(timings.Isha)}</td>
      </tr>
    `;
  }).join('');
}

// Update Month Display
function updateMonthDisplay() {
  if (!currentMonthDisplay) return;

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  currentMonthDisplay.textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;
}

// Render Quotes
function renderQuotes() {
  if (!quotesList) return;

  // Mahmud Efendi Kuddise Sirruhu'nun sözleri
  const quotes = [
    {
      text: 'Gelirsiniz ver bana tarikat, sonra bırakırsınız, namaza başlar, bırakırsınız, çarşafı giyer, çıkarırsınız.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Şalvar giymekten utanırsınız, sakal, cübbe, çarşaf, uzun entari, bakın İslam kıyafetidir bu. Sen bunları giymekle "ben Müslüman\'ım, benim sağlığımda islamiyete kimse yan bakamaz" demek istiyorsun.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Çarşaflarınızı muhafaza ediyorsunuz Elhamdülillah, ama bilmiyorum entarileriniz nasıldır?',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Kadınların şerefi gizli kalmalarında ve erkeklerle görüşmemelerindedir. Kadın çalışacak diye tutturmuş, sonra aç kalırlarmış. Sen karışmasana, o Allahu Teala yarattığının rızkını verir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Sizin çarşafınız bizim sarığımız, şalvarımız, sizi gören alacağını alıyor, birde tatlı sözlen konuşursan onunla, tamam.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Dilenci at üstünde gelse vereceksin, şüpheleniyorsan az ver, şüphelenmiyorsan çok ver.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Aklı başında olan adamın evinde televizyon olmaz.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'En büyük günah sorulursa, nedir? Kafirlere meyletmektir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Karınca bacağı kadar olsa bile ekmek atmayın, bu bizi helak eder.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Televizyon hiç Mevla\'yı hatırlatır mı? Zehir zakkum akıtıyor.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Ruh ile beden bir olmazsa bir milyon kere Allah (c.c) desen boş.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Çarşaf giymekle büyük yiğitlik yapıyorsunuz, milletin tesettüre heves etmesine sebep oluyorsunuz.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Çarşafınızı iyi muhafaza edin. Şunu yakinen bilin ki; bir çarşafı, bir sarığı bozmakla Çeçenistan\'a gelen belayı bize de verebilir Cenab-ı hak.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Can vermeli çarşaftan vazgeçmemeli, ne güzel şeydir o.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bu çarşafı giyen hanımlar, bilseler onların sayesinde neler oluyor, yatarken de giyerler. Siz ki Allah için tesettürünüzü muhafaza ettiniz O da sizi muhafaza eder.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bir Hoca yüzbin televizyondan daha tesirlidir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Rabıta muhabbetle olur, muhabbette ittiba ile olur. İttiba edersen seversin ve sevilirsin.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Mektubattan uzak kalındığı an feyiz kesilir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Sarığı kabul etmeyenin Peygamberimiz (s.a.v.), Cebrail (a.s.), Allah-u Teala (c.c.)\'de kabul etmiyor.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Dünya içinde herşey melundur, fakat zikrullah ile meşgul olan emri bil maruf nehy-i anil münker yapan okuyan ve okutan değildir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Avrupa modasına uymak, namazı terk etmekten daha ağır geliyor.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Televizyon seyreden dinini sevmiyor demektir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bir kimse asılacağından korktuğu gibi imandan küfre döneceğinden de öyle korkacak.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Sen nefsini hak ile meşgul etmezsen, nefis seni batıl ile meşgul eder.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bir kimse emri bil maruf yapacağım diye yola çıksa sonra siyasetten bahsetse, onun azabını kimse ölçemez.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Dünya sevgisi insanı şaraptan daha sarhoş eder ve ateşe girmeye cesaret verir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Kalın kafalı nefse uyarsan her yerde rezilsin.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'İnsan bir nefes sağ olsa çok ilerler.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bütün haramlar nefse dostluk, Mevla\'ya (c.c.) düşmanlıktır.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Gezdiğimiz yerlerde talebe var, medrese yapacak para yok. Milyarlar gidiyor başka yerlere ama medreseye para yok. Bunların hepsi ahirette acısını çekecek.',
      author: 'Mahmud Efendi (k.s)'
    }
  ];

  quotesList.innerHTML = quotes.map(quote => `
    <div class="quote-card">
      <p class="quote-text">${quote.text}</p>
      <p class="quote-author">— ${quote.author}</p>
    </div>
  `).join('');
}


// Update user coordinates when location is fetched
async function fetchPrayerTimesWithCoords(latitude, longitude) {
  userCoordinates.latitude = latitude;
  userCoordinates.longitude = longitude;
  await fetchPrayerTimes(latitude, longitude);
}

// ============================================
// Daily Quote Modal
// ============================================

const quoteModalOverlay = document.getElementById('quote-modal-overlay');
const quoteModalClose = document.getElementById('quote-modal-close');
const quoteModalText = document.getElementById('quote-modal-text');

// Get all quotes (same array as in renderQuotes)
function getAllQuotes() {
  return [
    {
      text: 'Gelirsiniz ver bana tarikat, sonra bırakırsınız, namaza başlar, bırakırsınız, çarşafı giyer, çıkarırsınız.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Şalvar giymekten utanırsınız, sakal, cübbe, çarşaf, uzun entari, bakın İslam kıyafetidir bu. Sen bunları giymekle "ben Müslüman\'ım, benim sağlığımda islamiyete kimse yan bakamaz" demek istiyorsun.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Çarşaflarınızı muhafaza ediyorsunuz Elhamdülillah, ama bilmiyorum entarileriniz nasıldır?',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Kadınların şerefi gizli kalmalarında ve erkeklerle görüşmemelerindedir. Kadın çalışacak diye tutturmuş, sonra aç kalırlarmış. Sen karışmasana, o Allahu Teala yarattığının rızkını verir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Sizin çarşafınız bizim sarığımız, şalvarımız, sizi gören alacağını alıyor, birde tatlı sözlen konuşursan onunla, tamam.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Dilenci at üstünde gelse vereceksin, şüpheleniyorsan az ver, şüphelenmiyorsan çok ver.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Aklı başında olan adamın evinde televizyon olmaz.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'En büyük günah sorulursa, nedir? Kafirlere meyletmektir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Karınca bacağı kadar olsa bile ekmek atmayın, bu bizi helak eder.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Televizyon hiç Mevla\'yı hatırlatır mı? Zehir zakkum akıtıyor.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Ruh ile beden bir olmazsa bir milyon kere Allah (c.c) desen boş.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Çarşaf giymekle büyük yiğitlik yapıyorsunuz, milletin tesettüre heves etmesine sebep oluyorsunuz.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Çarşafınızı iyi muhafaza edin. Şunu yakinen bilin ki; bir çarşafı, bir sarığı bozmakla Çeçenistan\'a gelen belayı bize de verebilir Cenab-ı hak.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Can vermeli çarşaftan vazgeçmemeli, ne güzel şeydir o.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bu çarşafı giyen hanımlar, bilseler onların sayesinde neler oluyor, yatarken de giyerler. Siz ki Allah için tesettürünüzü muhafaza ettiniz O da sizi muhafaza eder.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bir Hoca yüzbin televizyondan daha tesirlidir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Rabıta muhabbetle olur, muhabbette ittiba ile olur. İttiba edersen seversin ve sevilirsin.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Mektubattan uzak kalındığı an feyiz kesilir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Sarığı kabul etmeyenin Peygamberimiz (s.a.v.), Cebrail (a.s.), Allah-u Teala (c.c.)\'de kabul etmiyor.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Dünya içinde herşey melundur, fakat zikrullah ile meşgul olan emri bil maruf nehy-i anil münker yapan okuyan ve okutan değildir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Avrupa modasına uymak, namazı terk etmekten daha ağır geliyor.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Televizyon seyreden dinini sevmiyor demektir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bir kimse asılacağından korktuğu gibi imandan küfre döneceğinden de öyle korkacak.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Sen nefsini hak ile meşgul etmezsen, nefis seni batıl ile meşgul eder.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bir kimse emri bil maruf yapacağım diye yola çıksa sonra siyasetten bahsetse, onun azabını kimse ölçemez.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Dünya sevgisi insanı şaraptan daha sarhoş eder ve ateşe girmeye cesaret verir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Kalın kafalı nefse uyarsan her yerde rezilsin.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'İnsan bir nefes sağ olsa çok ilerler.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bütün haramlar nefse dostluk, Mevla\'ya (c.c.) düşmanlıktır.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Gezdiğimiz yerlerde talebe var, medrese yapacak para yok. Milyarlar gidiyor başka yerlere ama medreseye para yok. Bunların hepsi ahirette acısını çekecek.',
      author: 'Mahmud Efendi (k.s)'
    }
  ];
}

// Show random quote on page load
function showDailyQuote() {
  const allQuotes = getAllQuotes();
  const randomIndex = Math.floor(Math.random() * allQuotes.length);
  const randomQuote = allQuotes[randomIndex];

  if (quoteModalText) {
    quoteModalText.textContent = randomQuote.text;
  }

  // Show modal after a short delay for better effect
  setTimeout(() => {
    if (quoteModalOverlay) {
      quoteModalOverlay.classList.add('active');
    }
  }, 800);
}

// Close quote modal
function closeQuoteModal() {
  if (quoteModalOverlay) {
    quoteModalOverlay.classList.remove('active');
  }
}

// Event listeners for quote modal
if (quoteModalClose) {
  quoteModalClose.addEventListener('click', closeQuoteModal);
}

if (quoteModalOverlay) {
  quoteModalOverlay.addEventListener('click', (e) => {
    // Close if clicked on overlay, not the modal itself
    if (e.target === quoteModalOverlay) {
      closeQuoteModal();
    }
  });
}

// Initialize app after all functions are defined
initTabs();
init();
showDailyQuote(); // Show random quote on page load

