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
            link.innerHTML = '<span class="text-sky-500">Copied!</span>';
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

        const options = { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: false };
        const formatter = new Intl.DateTimeFormat([], options);
        const timeStr = formatter.format(new Date());

        const userOffset = -new Date().getTimezoneOffset() / 60;
        const bdOffset = 6;
        const diff = bdOffset - userOffset;

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
                slider.classList.add('bg-sky-500', 'dark:bg-sky-400');

                // Reset after 2.5s
                setTimeout(() => {
                    slider.style.transition = 'transform 0.4s ease';
                    slider.style.transform = 'translateX(0)';
                    slider.classList.remove('bg-sky-500', 'dark:bg-sky-400');
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
                showcaseCopyBtn.classList.add('bg-sky-400', 'dark:bg-sky-500');
                setTimeout(() => {
                    showcaseCopyBtn.textContent = original;
                    showcaseCopyBtn.classList.remove('bg-sky-400', 'dark:bg-sky-500');
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

function initTaglineCycler() {
    const phrases = ["Open Source Contributor", "Design Engineer", "Creating with code. Small details matter."];
    const taglineEl = document.getElementById('profile-tagline');
    let currentPhraseIndex = 0;

    if (taglineEl) {
        taglineEl.textContent = phrases[currentPhraseIndex];
        taglineEl.style.opacity = '1';
        taglineEl.style.transform = 'translateY(0)';
        taglineEl.style.display = 'inline-block';
        taglineEl.style.transition = 'all 0.4s ease';

        setInterval(() => {
            taglineEl.style.opacity = '0';
            taglineEl.style.transform = 'translateY(8px)';

            setTimeout(() => {
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                taglineEl.textContent = phrases[currentPhraseIndex];

                taglineEl.style.transition = 'none';
                taglineEl.style.transform = 'translateY(-8px)';

                void taglineEl.offsetWidth; // Force reflow

                taglineEl.style.transition = 'all 0.4s ease';
                taglineEl.style.opacity = '1';
                taglineEl.style.transform = 'translateY(0)';
            }, 400);
        }, 2500);
    }
}

function initGitHubHeatmap() {
    const container = document.getElementById('github-heatmap');
    if (!container) return;

    const weeks = 53;
    const levelClasses = [
        'bg-sky-50 dark:bg-sky-950/40',
        'bg-sky-100 dark:bg-sky-900/50',
        'bg-sky-200 dark:bg-sky-800/60',
        'bg-sky-300 dark:bg-sky-700/70',
        'bg-sky-500 dark:bg-sky-500'
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (weeks - 1) * 7);
    while (startDate.getDay() !== 0) startDate.setDate(startDate.getDate() - 1);

    let totalContributions = 0;
    const cells = [];
    const monthLabels = [];
    let lastMonth = '';

    for (let w = 0; w < weeks; w++) {
        const weekDate = new Date(startDate);
        weekDate.setDate(weekDate.getDate() + w * 7);
        const month = weekDate.toLocaleString('en-US', { month: 'short' });
        monthLabels.push(month !== lastMonth ? month : '');
        lastMonth = month;

        for (let d = 0; d < 7; d++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + w * 7 + d);
            const lv = date > endDate ? 0 : (Math.random() < 0.32 ? 0 : Math.floor(Math.random() * 5));
            const count = lv === 0 ? 0 : lv * 2 + Math.floor(Math.random() * 3);
            totalContributions += count;
            cells.push({ level: lv, count });
        }
    }

    const monthHtml = monthLabels.map((label, i) =>
        `<span class="github-month-label" style="grid-column:${i + 1}">${label}</span>`
    ).join('');

    const gridHtml = cells.map(({ level, count }) =>
        `<div class="github-cell ${levelClasses[level]}" title="${count} contribution${count !== 1 ? 's' : ''}"></div>`
    ).join('');

    const legendHtml = levelClasses.map(cls => `<div class="github-cell ${cls}"></div>`).join('');

    container.innerHTML = `
        <div class="glass-card github-heatmap-card rounded-2xl p-4 sm:p-5">
            <div class="github-heatmap-scroll no-scrollbar">
                <div class="github-heatmap">
                    <div class="github-months">${monthHtml}</div>
                    <div class="github-grid">${gridHtml}</div>
                </div>
            </div>
            <div class="github-footer">
                <span>${totalContributions.toLocaleString()} contributions in the past 365 days.</span>
                <div class="github-legend">
                    <span>Less</span>
                    ${legendHtml}
                    <span>More</span>
                </div>
            </div>
        </div>
    `;
}

function initMobileNav() {
    const btn = document.getElementById('mobile-nav-btn');
    const panel = document.getElementById('mobile-nav-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
        const isOpen = panel.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    panel.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            panel.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
        });
    });
}

const PROJECTS_DATA = [
    {
        title: 'React Wheel Picker',
        date: '05.2025–∞',
        url: 'https://example.com',
        description: 'iOS-like wheel picker for React with smooth inertia scrolling and infinite loop support.',
        bullets: [
            'Natural touch scrolling with smooth inertia, mouse drag and scroll for desktop',
            'Infinite loop scrolling',
            'Unstyled core for complete style customization',
            'Full keyboard navigation and type-ahead search'
        ],
        tags: ['Open Source', 'React', 'TypeScript', 'Monorepo', 'Turborepo', 'pnpm-workspace', 'Package Publishing', 'NPM Registry', 'GitHub Actions'],
        defaultOpen: true
    },
    {
        title: 'Analytics Dashboard',
        date: '03.2023–06.2024',
        url: 'https://example.com',
        description: 'Real-time analytics dashboard with interactive charts and customizable widgets for SaaS teams.',
        bullets: ['Live data streaming with WebSocket updates', 'Drag-and-drop widget layout', 'Export to CSV and PDF'],
        tags: ['React', 'D3.js', 'TypeScript', 'Tailwind CSS']
    },
    {
        title: 'Design System UI',
        date: '01.2023–∞',
        url: 'https://example.com',
        description: 'Accessible component library with Storybook documentation and Figma design tokens.',
        bullets: ['50+ production-ready components', 'WCAG 2.1 AA compliant', 'Dark mode support'],
        tags: ['React', 'Storybook', 'Radix UI', 'Open Source']
    },
    {
        title: 'Cloud Dev Environment',
        date: '06.2024–∞',
        url: 'https://example.com',
        description: 'Browser-based development environment with instant preview and collaborative editing.',
        bullets: ['Zero-config project templates', 'Real-time collaboration', 'Integrated terminal'],
        tags: ['Next.js', 'WebContainers', 'TypeScript']
    },
    {
        title: 'Collaborative Workspace',
        date: '02.2024–12.2024',
        url: 'https://example.com',
        description: 'Team workspace for async communication, task boards, and document sharing.',
        bullets: ['Kanban and list views', 'Rich text editor with mentions', 'Slack integration'],
        tags: ['React', 'Node.js', 'PostgreSQL', 'Redis']
    },
    {
        title: 'AI Core Search Engine',
        date: '08.2025–∞',
        url: 'https://example.com',
        description: 'Semantic search engine powered by embeddings with hybrid keyword and vector retrieval.',
        bullets: ['Sub-100ms query latency', 'Multi-language support', 'Self-hosted deployment'],
        tags: ['Python', 'OpenAI', 'Vector DB', 'FastAPI']
    },
    {
        title: 'Edge KV Database',
        date: '04.2025–∞',
        url: 'https://example.com',
        description: 'Globally distributed key-value store with edge replication and strong consistency.',
        bullets: ['Global read latency under 50ms', 'Automatic failover', 'REST and gRPC APIs'],
        tags: ['Rust', 'Distributed Systems', 'Open Source']
    },
    {
        title: 'SaaSify Platform',
        date: '11.2024–∞',
        url: 'https://example.com',
        description: 'All-in-one platform for launching and scaling micro-SaaS products.',
        bullets: ['Billing and subscription management', 'User authentication', 'Analytics dashboard'],
        tags: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL']
    },
    {
        title: 'Developer Portfolio Template',
        date: '09.2023–∞',
        url: 'https://example.com',
        description: 'Open-source portfolio template inspired by modern design engineer sites.',
        bullets: ['Dark and light themes', 'MDX blog support', 'One-click Vercel deploy'],
        tags: ['Astro', 'Tailwind CSS', 'Open Source']
    },
    {
        title: 'Real-time Chat App',
        date: '05.2022–08.2022',
        url: 'https://example.com',
        description: 'WebSocket-based chat application with rooms, typing indicators, and file sharing.',
        bullets: ['End-to-end encryption option', 'Message reactions', 'Mobile responsive'],
        tags: ['React', 'Socket.io', 'MongoDB']
    },
    {
        title: 'E-commerce Microservices',
        date: '03.2023–10.2023',
        url: 'https://example.com',
        description: 'Microservices architecture for a scalable e-commerce platform.',
        bullets: ['Event-driven order processing', 'Inventory management', 'Payment gateway integration'],
        tags: ['Node.js', 'Kafka', 'Docker', 'Kubernetes']
    },
    {
        title: 'Markdown Editor',
        date: '01.2022–04.2022',
        url: 'https://example.com',
        description: 'WYSIWYG markdown editor with live preview and syntax highlighting.',
        bullets: ['Split-pane editing', 'Custom themes', 'Export to HTML and PDF'],
        tags: ['React', 'ProseMirror', 'TypeScript']
    }
];

const AWARDS_DATA = [
    {
        title: 'Best Front-End Architecture',
        date: '2023',
        org: 'Web Design Gala',
        prize: '1st Place',
        url: 'https://example.com',
        description: 'Recognized for building a scalable, accessible front-end architecture serving 2M+ monthly users.',
        bullets: ['Led migration from monolith to micro-frontends', 'Reduced bundle size by 40%', 'Achieved 95+ Lighthouse score'],
        tags: ['Front-End', 'Architecture', 'Performance'],
        defaultOpen: true
    },
    {
        title: 'Outstanding Contributor',
        date: '2022',
        org: 'Global Open-Source Summit',
        prize: 'Gold Medal',
        url: 'https://example.com',
        description: 'Awarded for significant contributions to open-source UI component libraries.',
        bullets: ['500+ merged pull requests', 'Maintainer of 3 popular packages', 'Mentored 20+ new contributors'],
        tags: ['Open Source', 'Community', 'Leadership']
    },
    {
        title: 'Pixel Perfect UI Design Award',
        date: '2021',
        org: 'Developer Choice',
        prize: 'Honorable Mention',
        url: 'https://example.com',
        description: 'Honored for exceptional attention to detail in UI implementation and design systems.',
        bullets: ['Pixel-perfect Figma-to-code workflow', 'Consistent design token system', 'Cross-browser compatibility'],
        tags: ['UI Design', 'Design Systems', 'CSS']
    }
];

function renderAccordionItem(item, index, type) {
    const subtitle = type === 'award'
        ? `${item.org} · ${item.prize}`
        : item.date;
    const openClass = item.defaultOpen ? ' is-open' : '';
    const hiddenClass = index >= 5 && type === 'project' ? ' is-hidden' : '';

    return `
        <div class="accordion-item${openClass}${hiddenClass}" data-index="${index}" data-type="${type}">
            <button class="accordion-header" type="button" aria-expanded="${item.defaultOpen ? 'true' : 'false'}">
                <span class="accordion-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                </span>
                <span class="accordion-meta">
                    <div class="accordion-title">${item.title}</div>
                    <div class="accordion-date">${subtitle}</div>
                </span>
                <span class="accordion-actions">
                    <a href="${item.url}" target="_blank" rel="noopener" class="accordion-action-btn" aria-label="Open link" onclick="event.stopPropagation()">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </a>
                </span>
            </button>
            <div class="accordion-body">
                <p class="accordion-desc">${item.description}</p>
                ${item.bullets && item.bullets.length ? `<ul class="accordion-bullets">${item.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
                ${item.tags && item.tags.length ? `<div class="accordion-tags">${item.tags.map(t => `<span class="accordion-tag">${t}</span>`).join('')}</div>` : ''}
            </div>
        </div>
    `;
}

function initAccordionList(listId, data, type) {
    const list = document.getElementById(listId);
    if (!list) return;

    list.innerHTML = data.map((item, i) => renderAccordionItem(item, i, type)).join('');

    list.addEventListener('click', (e) => {
        const header = e.target.closest('.accordion-header');
        if (!header) return;

        const item = header.closest('.accordion-item');
        if (!item) return;

        if (item.classList.contains('is-open')) {
            item.classList.remove('is-open');
            header.setAttribute('aria-expanded', 'false');
        } else {
            list.querySelectorAll('.accordion-item.is-open').forEach(el => {
                el.classList.remove('is-open');
                el.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
            });
            item.classList.add('is-open');
            header.setAttribute('aria-expanded', 'true');
        }
    });
}

const CERTS_DATA = [
    { title: 'Advanced Front-End Engineer', org: 'Tech Institute', year: '2023', url: 'https://example.com' },
    { title: 'React Developer Certification', org: 'Meta', year: '2023', url: 'https://example.com' },
    { title: 'AWS Certified Cloud Practitioner', org: 'Amazon Web Services', year: '2024', url: 'https://example.com' },
    { title: 'JavaScript Algorithms & Data Structures', org: 'FreeCodeCamp', year: '2022', url: 'https://example.com' },
    { title: 'UI/UX Design Specialist', org: 'IDF', year: '2022', url: 'https://example.com' },
    { title: 'NextJS Developer Certificate', org: 'Vercel', year: '2023', url: 'https://example.com' },
    { title: 'Tailwind CSS Styling Expert', org: 'Tailwind Labs', year: '2023', url: 'https://example.com' },
    { title: 'Fullstack Development Bootcamp', org: 'Coding Academy', year: '2022', url: 'https://example.com' },
    { title: 'MongoDB Database Administrator', org: 'MongoDB', year: '2023', url: 'https://example.com' },
    { title: 'Docker Associate Developer', org: 'Docker', year: '2023', url: 'https://example.com' },
    { title: 'Git Version Control Masterclass', org: 'GitHub', year: '2022', url: 'https://example.com' },
    { title: 'Responsive Web Design', org: 'FreeCodeCamp', year: '2021', url: 'https://example.com' },
    { title: 'Node.js Backend Developer', org: 'OpenJS Foundation', year: '2023', url: 'https://example.com' },
    { title: 'CSS Layout Masterclass', org: 'CSS-Tricks', year: '2022', url: 'https://example.com' },
    { title: 'Agile Software Development', org: 'Scrum Alliance', year: '2021', url: 'https://example.com' },
    { title: 'Python Programming Fundamentals', org: 'University of Michigan', year: '2021', url: 'https://example.com' },
    { title: 'Advanced TypeScript Design', org: 'TypeScript Org', year: '2023', url: 'https://example.com' },
    { title: 'Cloudflare Workers Deployment', org: 'Cloudflare', year: '2024', url: 'https://example.com' },
    { title: 'Web Performance Optimization', org: 'Google', year: '2023', url: 'https://example.com' },
    { title: 'UX Research Methodologies', org: 'IDF', year: '2022', url: 'https://example.com' },
    { title: 'Linux System Administrator', org: 'Red Hat', year: '2022', url: 'https://example.com' }
];

const BOOKMARKS_DATA = [
    { title: 'shadcn/ui Design Tokens', org: 'shadcn.com', date: '06.2023', url: 'https://shadcn.com' },
    { title: 'Tailwind CSS Documentation', org: 'tailwindcss.com', date: '03.2023', url: 'https://tailwindcss.com' },
    { title: 'React Server Components Guide', org: 'react.dev', date: '01.2024', url: 'https://react.dev' },
    { title: 'Base UI Component Reference', org: 'base-ui.com', date: '12.2023', url: 'https://base-ui.com' },
    { title: 'Motion Animation Best Practices', org: 'motion.dev', date: '11.2023', url: 'https://motion.dev' },
    { title: 'TypeScript Deep Dive', org: 'typescriptlang.org', date: '10.2023', url: 'https://typescriptlang.org' },
    { title: 'DigitalOcean Tutorials', org: 'digitalocean.com', date: '09.2023', url: 'https://digitalocean.com' },
    { title: 'Vercel Edge Functions', org: 'vercel.com', date: '08.2023', url: 'https://vercel.com' },
    { title: 'Radix UI Primitives', org: 'radix-ui.com', date: '07.2023', url: 'https://radix-ui.com' },
    { title: 'Next.js App Router Docs', org: 'nextjs.org', date: '06.2023', url: 'https://nextjs.org' },
    { title: 'CSS Tricks Almanac', org: 'css-tricks.com', date: '05.2023', url: 'https://css-tricks.com' },
    { title: 'Framer Motion Examples', org: 'framer.com', date: '04.2023', url: 'https://framer.com' },
    { title: 'Storybook Component Docs', org: 'storybook.js.org', date: '03.2023', url: 'https://storybook.js.org' },
    { title: 'MDN Web Docs', org: 'developer.mozilla.org', date: '02.2023', url: 'https://developer.mozilla.org' },
    { title: 'GitHub Actions Workflow', org: 'github.com', date: '01.2023', url: 'https://github.com' },
    { title: 'Figma Dev Mode Guide', org: 'figma.com', date: '12.2022', url: 'https://figma.com' },
    { title: 'Web.dev Performance', org: 'web.dev', date: '11.2022', url: 'https://web.dev' },
    { title: 'Lighthouse Scoring Guide', org: 'web.dev', date: '10.2022', url: 'https://web.dev' }
];

function renderListCard(item) {
    const subtitle = item.date
        ? `@${item.org} · ${item.date}`
        : `@${item.org} · ${item.year}`;
    const badge = item.date || item.year;

    return `
        <a href="${item.url}" target="_blank" rel="noopener" class="list-item-card glass-card rounded-xl p-4 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors group block">
            <div class="flex justify-between items-start gap-3">
                <div class="min-w-0">
                    <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-accent transition-colors truncate">${item.title}</div>
                    <div class="text-xs text-zinc-500 mt-1 truncate">${subtitle}</div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <span class="text-xs font-mono text-zinc-400">${badge}</span>
                    <svg class="w-3.5 h-3.5 text-zinc-400 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </div>
            </div>
        </a>
    `;
}

function initCardGrid(gridId, data, visibleCount, btnId, textId, iconId) {
    const grid = document.getElementById(gridId);
    const btn = document.getElementById(btnId);
    const text = document.getElementById(textId);
    const icon = document.getElementById(iconId);
    if (!grid) return;

    grid.innerHTML = data.map((item, i) => {
        const hidden = i >= visibleCount ? ' is-hidden' : '';
        return `<div class="card-grid-item${hidden}">${renderListCard(item)}</div>`;
    }).join('');

    if (!btn) return;

    btn.addEventListener('click', () => {
        const hidden = grid.querySelectorAll('.card-grid-item.is-hidden');
        const isCollapsed = hidden.length > 0;
        grid.querySelectorAll('.card-grid-item').forEach(el => el.classList.remove('is-hidden'));
        if (isCollapsed) {
            btn.setAttribute('aria-expanded', 'true');
            if (text) text.textContent = 'Show Less';
            if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
            grid.querySelectorAll('.card-grid-item').forEach((el, i) => {
                if (i >= visibleCount) el.classList.add('is-hidden');
            });
            btn.setAttribute('aria-expanded', 'false');
            if (text) text.textContent = 'Show More';
            if (icon) icon.style.transform = 'rotate(0deg)';
        }
    });
}

function initProjectsShowMore() {
    const btn = document.getElementById('proj-toggle-btn');
    const list = document.getElementById('projects-list');
    const text = document.getElementById('proj-toggle-text');
    const icon = document.getElementById('proj-toggle-icon');
    if (!btn || !list) return;

    btn.addEventListener('click', () => {
        const hidden = list.querySelectorAll('.accordion-item.is-hidden');
        const isCollapsed = hidden.length > 0;
        list.querySelectorAll('.accordion-item').forEach(el => el.classList.remove('is-hidden'));
        if (isCollapsed) {
            btn.setAttribute('aria-expanded', 'true');
            if (text) text.textContent = 'Show Less';
            if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
            list.querySelectorAll('.accordion-item').forEach((el, i) => {
                if (i >= 5) el.classList.add('is-hidden');
            });
            btn.setAttribute('aria-expanded', 'false');
            if (text) text.textContent = 'Show More';
            if (icon) icon.style.transform = 'rotate(0deg)';
        }
    });
}

function initToggles() {
    const setupToggle = (btnId, expandedId, textId, iconId) => {
        const btn = document.getElementById(btnId);
        const expanded = document.getElementById(expandedId);
        const text = document.getElementById(textId);
        const icon = document.getElementById(iconId);

        if (btn && expanded) {
            btn.addEventListener('click', () => {
                const isExpanded = expanded.classList.contains('is-open');
                if (isExpanded) {
                    expanded.classList.remove('is-open');
                    btn.setAttribute('aria-expanded', 'false');
                    if (text) text.textContent = 'Show More';
                    if (icon) icon.style.transform = 'rotate(0deg)';
                } else {
                    expanded.classList.add('is-open');
                    btn.setAttribute('aria-expanded', 'true');
                    if (text) text.textContent = 'Show Less';
                    if (icon) icon.style.transform = 'rotate(180deg)';
                }
            });
        }
    };

    setupToggle('exp-toggle-btn', 'experience-expanded', 'exp-toggle-text', 'exp-toggle-icon');
}

// DOMContentLoaded triggers
document.addEventListener('DOMContentLoaded', () => {
    initGitHubHeatmap();
    initAccordionList('projects-list', PROJECTS_DATA, 'project');
    initAccordionList('awards-list', AWARDS_DATA, 'award');
    initProjectsShowMore();
    initCardGrid('certs-grid', CERTS_DATA, 8, 'certs-toggle-btn', 'certs-toggle-text', 'certs-toggle-icon');
    initCardGrid('bookmarks-grid', BOOKMARKS_DATA, 6, 'bookmarks-toggle-btn', 'bookmarks-toggle-text', 'bookmarks-toggle-icon');
    initMobileNav();
    initIcons();
    initializeTheme();
    initLocalTime();
    initShowcase();
    initToggles();
    initScrollReveal();
    initTaglineCycler();
});
