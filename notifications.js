// Notification System for Prayer Times
class PrayerNotifications {
    constructor() {
        this.permission = Notification.permission;
        this.settings = this.loadSettings();
        this.checkInterval = null;
    }

    // Load settings from localStorage
    loadSettings() {
        const defaults = {
            enabled: false,
            minutesBefore: 10,
            enabledPrayers: {
                Tahajjud: true,
                Fajr: true,
                Sunrise: false,
                Dhuhr: true,
                Asr: true,
                Maghrib: true,
                Isha: true
            },
            soundEnabled: true
        };

        const saved = localStorage.getItem('notificationSettings');
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    }

    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    }

    // Request notification permission
    async requestPermission() {
        if (!('Notification' in window)) {
            alert('Bu tarayıcı bildirimleri desteklemiyor.');
            return false;
        }

        const permission = await Notification.requestPermission();
        this.permission = permission;

        if (permission === 'granted') {
            this.settings.enabled = true;
            this.saveSettings();
            this.showTestNotification();
            return true;
        } else {
            alert('Bildirim izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.');
            return false;
        }
    }

    // Show test notification
    showTestNotification() {
        new Notification('Namaz Vakti Bildirimleri Aktif! 🕌', {
            body: 'Namaz vakti bildirimleri başarıyla açıldı.',
            icon: '/namaz-vakti/icons/icon-192.png',
            badge: '/namaz-vakti/icons/icon-192.png',
            tag: 'test',
            requireInteraction: false
        });
    }

    // Show prayer time notification
    showPrayerNotification(prayerName, prayerTime, minutesBefore = 0) {
        if (!this.settings.enabled || this.permission !== 'granted') return;

        const title = minutesBefore > 0
            ? `${prayerName} Vakti Yaklaşıyor! ⏰`
            : `${prayerName} Vakti Girdi! 🕌`;

        const body = minutesBefore > 0
            ? `${prayerName} vaktine ${minutesBefore} dakika kaldı. (Saat: ${prayerTime})`
            : `${prayerName} vakti girmiştir. (Saat: ${prayerTime})`;

        const notification = new Notification(title, {
            body: body,
            icon: '/namaz-vakti/icons/icon-512.png',
            badge: '/namaz-vakti/icons/icon-192.png',
            tag: `prayer-${prayerName}-${minutesBefore}`,
            requireInteraction: true,
            vibrate: [200, 100, 200]
        });

        // Play sound if enabled
        if (this.settings.soundEnabled) {
            this.playNotificationSound();
        }

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }

    // Play notification sound
    playNotificationSound() {
        // Simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    // Start checking prayer times
    startChecking(prayerData) {
        if (!this.settings.enabled) return;

        // Clear existing interval
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        // Check every minute
        this.checkInterval = setInterval(() => {
            this.checkPrayerTimes(prayerData);
        }, 60000); // 60 seconds

        // Initial check
        this.checkPrayerTimes(prayerData);
    }

    // Check if it's time for notification
    checkPrayerTimes(prayerData) {
        if (!prayerData || !prayerData.timings) return;

        const now = new Date();
        const timings = prayerData.timings;

        Object.keys(timings).forEach(prayerKey => {
            // Skip if prayer notification is disabled
            if (!this.settings.enabledPrayers[prayerKey]) return;

            const timeStr = timings[prayerKey];
            const [hours, minutes] = timeStr.split(':').map(Number);

            const prayerTime = new Date();
            prayerTime.setHours(hours, minutes, 0, 0);

            // Check for exact prayer time
            const timeDiff = prayerTime - now;
            const minutesDiff = Math.round(timeDiff / 60000);

            // Notification at exact time (within 1 minute)
            if (minutesDiff === 0) {
                const storageKey = `notified-${prayerKey}-0-${timeStr}`;
                if (!sessionStorage.getItem(storageKey)) {
                    this.showPrayerNotification(window.PRAYER_NAMES_TR[prayerKey], timeStr, 0);
                    sessionStorage.setItem(storageKey, 'true');
                }
            }

            // Notification X minutes before
            if (minutesDiff === this.settings.minutesBefore) {
                const storageKey = `notified-${prayerKey}-${this.settings.minutesBefore}-${timeStr}`;
                if (!sessionStorage.getItem(storageKey)) {
                    this.showPrayerNotification(window.PRAYER_NAMES_TR[prayerKey], timeStr, this.settings.minutesBefore);
                    sessionStorage.setItem(storageKey, 'true');
                }
            }
        });
    }

    // Stop checking
    stopChecking() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    // Update settings
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
    }
}

// Export for use in main.js
window.PrayerNotifications = PrayerNotifications;
