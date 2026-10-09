/**
 * ============================================================================
 * DENİZ ALTUNAY - KİŞİSEL & KURUMSAL PORTFOLYO ETKİLEŞİM VE ÇEKİRDEK BETİĞİ
 * ============================================================================
 * - Tema Yöneticisi (Dark / Light Mode)
 * - Arka Plan Dinamik Ağ & Veri Canvas'ı (Kurumsal Mavi Palet)
 * - Matrix Dijital Yağmur Simülatörü (Easter Egg)
 * - Typewriter & Dinamik Metrik Sayaçları
 * - İnteraktif Kurumsal Konsol (Komut Girişi & Geçmişi)
 * - Veri Avcısı Mini Oyunu (Canvas, Skor Kaydı, Web Audio API)
 * - Canlı K-Means Yapay Zeka Kümeleme Simülatörü
 * - Panoya Kopyalama & Toast Bildirim Sistemi
 * ============================================================================
 */

(function () {
    'use strict';

    // ==========================================
    // 1. TEMA YÖNETİMİ (DARK / LIGHT MODE)
    // ==========================================
    class ThemeManager {
        constructor() {
            this.toggleBtn = document.getElementById('theme-toggle-btn');
            this.savedTheme = localStorage.getItem('da_theme') || 'dark';
            this.init();
        }

        init() {
            document.documentElement.setAttribute('data-theme', this.savedTheme);
            if (this.toggleBtn) {
                this.toggleBtn.addEventListener('click', () => this.toggle());
            }
        }

        toggle() {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('da_theme', next);
            showToast(`Tema değiştirildi: ${next === 'dark' ? 'Karanlık Mod' : 'Aydınlık Mod'}`, 'palette');
        }
    }

    // ==========================================
    // 2. NAVİGASYON, HEADER & SCROLL YÖNETİMİ
    // ==========================================
    class NavigationManager {
        constructor() {
            this.header = document.getElementById('site-header');
            this.hamburgerBtn = document.getElementById('hamburger-btn');
            this.drawer = document.getElementById('mobile-drawer');
            this.navAnchors = document.querySelectorAll('.nav-anchor, .mobile-nav-link');
            this.sections = document.querySelectorAll('section[id]');
            this.init();
        }

        init() {
            // Header scroll blur & shrink
            window.addEventListener('scroll', () => {
                if (window.scrollY > 40) {
                    this.header?.classList.add('scrolled');
                } else {
                    this.header?.classList.remove('scrolled');
                }
                this.updateActiveSection();
            }, { passive: true });

            // Mobil hamburger kontrolü
            if (this.hamburgerBtn && this.drawer) {
                this.hamburgerBtn.addEventListener('click', () => {
                    const isOpen = this.drawer.classList.contains('open');
                    this.setDrawerState(!isOpen);
                });

                // Linke tıklanınca çekmeceyi kapat
                this.navAnchors.forEach(link => {
                    link.addEventListener('click', () => {
                        this.setDrawerState(false);
                    });
                });

                // Dışarı tıklanınca kapat
                document.addEventListener('click', (e) => {
                    if (this.drawer.classList.contains('open') &&
                        !this.drawer.contains(e.target) &&
                        !this.hamburgerBtn.contains(e.target)) {
                        this.setDrawerState(false);
                    }
                });
            }

            // Pürüzsüz kaydırma linkleri
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId && targetId !== '#') {
                        const targetEl = document.querySelector(targetId);
                        if (targetEl) {
                            e.preventDefault();
                            const headerOffset = 70;
                            const elementPosition = targetEl.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            });
        }

        setDrawerState(open) {
            if (open) {
                this.drawer.classList.add('open');
                this.hamburgerBtn.classList.add('active');
                this.hamburgerBtn.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            } else {
                this.drawer.classList.remove('open');
                this.hamburgerBtn.classList.remove('active');
                this.hamburgerBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }

        updateActiveSection() {
            const scrollY = window.pageYOffset;
            this.sections.forEach(sec => {
                const secHeight = sec.offsetHeight;
                const secTop = sec.offsetTop - 120;
                const secId = sec.getAttribute('id');
                if (scrollY > secTop && scrollY <= secTop + secHeight) {
                    document.querySelectorAll(`.nav-anchor[href="#${secId}"]`).forEach(a => a.classList.add('active'));
                } else {
                    document.querySelectorAll(`.nav-anchor[href="#${secId}"]`).forEach(a => a.classList.remove('active'));
                }
            });
        }
    }

    // ==========================================
    // 3. TOAST BİLDİRİM SİSTEMİ
    // ==========================================
    function showToast(message, icon = 'check-circle', duration = 3000) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px) scale(0.95)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // ==========================================
    // 4. PANOYA KOPYALAMA (COPY TO CLIPBOARD)
    // ==========================================
    function initClipboardHandlers() {
        const copyBtns = document.querySelectorAll('#copy-email-btn, .copy-pill-btn, #direct-copy-btn, [data-email]');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = btn.getAttribute('data-email') || 'altnydeniz@gmail.com';
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(email).then(() => {
                        showToast(`E-posta adresi panoya kopyalandı: ${email}`, 'clipboard-check');
                    }).catch(() => fallbackCopy(email));
                } else {
                    fallbackCopy(email);
                }
            });
        });

        function fallbackCopy(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showToast(`E-posta adresi panoya kopyalandı: ${text}`, 'clipboard-check');
            } catch (err) {
                showToast(`E-posta: ${text}`, 'info-circle');
            }
            document.body.removeChild(textArea);
        }
    }

    // ==========================================
    // 5. TYPEWRITER (DAKTİLO EFEKTİ) & SAYAÇLAR
    // ==========================================
    class HeroEffects {
        constructor() {
            this.typewriterEl = document.getElementById('role-typewriter');
            this.roles = [
                'Veri Bilimi ve Analitiği',
                'Yapay Zeka & Makine Öğrenmesi',
                'Full-Stack SaaS Mimarisi',
                'Teknik SEO & Performans Mühendisliği'
            ];
            this.roleIdx = 0;
            this.charIdx = 0;
            this.isDeleting = false;
            this.init();
        }

        init() {
            if (this.typewriterEl) {
                this.type();
            }
            this.initCounters();
            this.initProfileCardTilt();
        }

        type() {
            const currentRole = this.roles[this.roleIdx];
            if (this.isDeleting) {
                this.typewriterEl.textContent = currentRole.substring(0, this.charIdx - 1);
                this.charIdx--;
            } else {
                this.typewriterEl.textContent = currentRole.substring(0, this.charIdx + 1);
                this.charIdx++;
            }

            let speed = this.isDeleting ? 40 : 80;

            if (!this.isDeleting && this.charIdx === currentRole.length) {
                speed = 2200; // Bekleme süresi
                this.isDeleting = true;
            } else if (this.isDeleting && this.charIdx === 0) {
                this.isDeleting = false;
                this.roleIdx = (this.roleIdx + 1) % this.roles.length;
                speed = 500;
            }

            setTimeout(() => this.type(), speed);
        }

        initCounters() {
            const counterEls = document.querySelectorAll('[data-counter]');
            if (!counterEls.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = parseInt(entry.target.getAttribute('data-counter'), 10);
                        this.animateCounter(entry.target, target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.6 });

            counterEls.forEach(el => observer.observe(el));
        }

        animateCounter(el, target) {
            let current = 0;
            const duration = 1600;
            const stepTime = 20;
            const increment = target / (duration / stepTime);
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current);
                }
            }, stepTime);
        }

        initProfileCardTilt() {
            const card = document.getElementById('profile-card');
            if (!card || window.innerWidth < 860) return;

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
            });
        }
    }

    // ==========================================
    // 6. ARKA PLAN SİNİR AĞI / AMBIENT CANVAS (KURUMSAL MAVİ)
    // ==========================================
    class AmbientNetwork {
        constructor() {
            this.canvas = document.getElementById('ambient-canvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.points = [];
            this.mouse = { x: null, y: null, maxDist: 140 };
            this.init();
        }

        init() {
            this.resize();
            window.addEventListener('resize', () => this.resize(), { passive: true });

            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            }, { passive: true });

            window.addEventListener('mouseleave', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });

            this.createPoints();
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.createPoints();
        }

        createPoints() {
            const density = window.innerWidth < 768 ? 35 : 70;
            this.points = [];
            for (let i = 0; i < density; i++) {
                this.points.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1
                });
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
            const nodeColor = isDark ? 'rgba(59, 130, 246, 0.45)' : 'rgba(37, 99, 235, 0.35)';
            const lineBase = isDark ? '59, 130, 246' : '37, 99, 235';

            for (let i = 0; i < this.points.length; i++) {
                const p = this.points[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = nodeColor;
                this.ctx.fill();

                // Çizgileri bağla
                for (let j = i + 1; j < this.points.length; j++) {
                    const p2 = this.points[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        const alpha = (1 - dist / 110) * (isDark ? 0.16 : 0.1);
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(${lineBase}, ${alpha})`;
                        this.ctx.lineWidth = 0.8;
                        this.ctx.stroke();
                    }
                }

                // Fare etkileşimi
                if (this.mouse.x !== null) {
                    const mdx = p.x - this.mouse.x;
                    const mdy = p.y - this.mouse.y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (mdist < this.mouse.maxDist) {
                        const mAlpha = (1 - mdist / this.mouse.maxDist) * 0.3;
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(this.mouse.x, this.mouse.y);
                        this.ctx.strokeStyle = `rgba(${lineBase}, ${mAlpha})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(() => this.animate());
        }
    }

    // ==========================================
    // 7. MATRIX RAIN SİMÜLATÖRÜ (EASTER EGG)
    // ==========================================
    class MatrixSimulator {
        constructor() {
            this.canvas = document.getElementById('matrix-canvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.isActive = false;
            this.fontSize = 16;
            this.columns = 0;
            this.drops = [];
            this.chars = '01DENIZALTUNAYDATA_SCIENCEML_PYTHONSQLAI_7894561230';
            this.animId = null;
            this.init();
        }

        init() {
            window.addEventListener('resize', () => {
                if (this.isActive) this.resize();
            });

            this.canvas.addEventListener('click', () => this.stop());
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isActive) {
                    this.stop();
                }
            });
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.columns = Math.floor(this.canvas.width / this.fontSize);
            this.drops = Array(this.columns).fill(1);
        }

        start() {
            if (this.isActive) return;
            this.isActive = true;
            this.canvas.classList.add('active');
            this.resize();
            document.body.style.overflow = 'hidden';
            this.draw();
            showToast('Matrix Modu Aktif! Çıkmak için ESC veya ekrana tıklayın.', 'code');
        }

        stop() {
            if (!this.isActive) return;
            this.isActive = false;
            this.canvas.classList.remove('active');
            document.body.style.overflow = '';
            if (this.animId) cancelAnimationFrame(this.animId);
            showToast('Matrix Modu Kapatıldı.', 'terminal');
        }

        draw() {
            if (!this.isActive) return;

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = '#3b82f6';
            this.ctx.font = `${this.fontSize}px monospace`;

            for (let i = 0; i < this.drops.length; i++) {
                const char = this.chars[Math.floor(Math.random() * this.chars.length)];
                const x = i * this.fontSize;
                const y = this.drops[i] * this.fontSize;

                this.ctx.fillText(char, x, y);

                if (y > this.canvas.height && Math.random() > 0.975) {
                    this.drops[i] = 0;
                }
                this.drops[i]++;
            }

            this.animId = requestAnimationFrame(() => this.draw());
        }
    }

    // ==========================================
    // 8. İNTERAKTİF LABORATUVAR - SEKMELER
    // ==========================================
    class PlaygroundTabs {
        constructor() {
            this.tabButtons = document.querySelectorAll('.tab-btn');
            this.panels = document.querySelectorAll('.tab-panel');
            this.init();
        }

        init() {
            this.tabButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const target = btn.getAttribute('data-tab-target');
                    this.tabButtons.forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-selected', 'false');
                    });
                    this.panels.forEach(p => p.classList.remove('active'));

                    btn.classList.add('active');
                    btn.setAttribute('aria-selected', 'true');

                    const activePanel = document.getElementById(`tab-${target}`);
                    if (activePanel) {
                        activePanel.classList.add('active');
                    }
                });
            });
        }
    }

    // ==========================================
    // 9. TAB 1: SİBER TERMİNAL & KOMUT ÇALIŞTIRICI
    // ==========================================
    class CyberTerminal {
        constructor(matrixSim) {
            this.matrixSim = matrixSim;
            this.form = document.getElementById('terminal-form');
            this.input = document.getElementById('term-input-field');
            this.output = document.getElementById('terminal-output');
            this.clearBtn = document.getElementById('clear-term-btn');
            this.quickBtns = document.querySelectorAll('.quick-cmd-btn');
            this.history = [];
            this.histIndex = -1;
            this.init();
        }

        init() {
            if (!this.form || !this.input || !this.output) return;

            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                const cmd = this.input.value.trim();
                if (cmd) {
                    this.history.push(cmd);
                    this.histIndex = this.history.length;
                    this.execute(cmd);
                    this.input.value = '';
                }
            });

            // Yukarı/Aşağı tuşları ile geçmiş
            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp') {
                    if (this.histIndex > 0) {
                        this.histIndex--;
                        this.input.value = this.history[this.histIndex];
                    }
                    e.preventDefault();
                } else if (e.key === 'ArrowDown') {
                    if (this.histIndex < this.history.length - 1) {
                        this.histIndex++;
                        this.input.value = this.history[this.histIndex];
                    } else {
                        this.histIndex = this.history.length;
                        this.input.value = '';
                    }
                    e.preventDefault();
                }
            });

            // Temizleme butonu
            if (this.clearBtn) {
                this.clearBtn.addEventListener('click', () => this.clear());
            }

            // Hızlı butonlar
            this.quickBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const cmd = btn.getAttribute('data-cmd');
                    if (cmd) {
                        this.execute(cmd);
                        this.input.focus();
                    }
                });
            });
        }

        execute(cmdStr) {
            const clean = cmdStr.toLowerCase().trim();
            this.printCommand(cmdStr);

            switch (clean) {
                case 'help':
                    this.printOutput(`
                    <div class="term-output-block">
                        <strong>📌 Kullanılabilir Komutlar:</strong><br>
                        • <span class="term-highlight">about</span> : Deniz Altunay hakkında detaylı kurumsal özet.<br>
                        • <span class="term-highlight">skills</span> : Teknik yetkinlikler ve teknoloji yığını.<br>
                        • <span class="term-highlight">projects</span> : Geliştirilen kurumsal projeler.<br>
                        • <span class="term-highlight">matrix</span> : Matrix kod yağmurunu başlatır.<br>
                        • <span class="term-highlight">coffee</span> : Geliştiriciye taze bir kahve ikram eder.<br>
                        • <span class="term-highlight">quote</span> : İlham verici veri bilimi ve mühendislik sözü.<br>
                        • <span class="term-highlight">contact</span> : İletişim adresleri ve bağlantılar.<br>
                        • <span class="term-highlight">sudo hire</span> : İş birliği & teklif başlatıcı.<br>
                        • <span class="term-highlight">clear</span> : Konsol ekranını temizler.
                    </div>`);
                    break;

                case 'about':
                    this.printOutput(`
                    <div class="term-output-block">
                        <strong>👤 Deniz Altunay</strong><br>
                        • Üniversite: İstanbul Topkapı Üniversitesi Veri Bilimi ve Analitiği<br>
                        • Odak: Yapay Zeka, Makine Öğrenmesi, Analitik SaaS Mimarileri & Yüksek Hızlı Web.<br>
                        • Konum: İstanbul, Türkiye<br>
                        • Misyon: Veriyi işleyerek kurumlara ve dünyaya ölçeklenebilir, optimize çözümler sunmak.
                    </div>`);
                    break;

                case 'skills':
                    this.printOutput(`
                    <div class="term-output-block">
                        <strong>⚡ Teknik Yetkinlikler:</strong><br>
                        [Veri Bilimi] : Python, Pandas, NumPy, Scikit-learn, TensorFlow, R<br>
                        [Veritabanı]  : SQL, PostgreSQL, Veri Modelleme & Sorgu Optimizasyonu<br>
                        [Yazılım/Web] : JavaScript (ES6+), Modern Web, SaaS Mimarisi, RESTful API<br>
                        [Mühendislik] : Teknik SEO, Core Web Vitals, Git, AWS Cloud Entegrasyonu
                    </div>`);
                    break;

                case 'projects':
                    this.printOutput(`
                    <div class="term-output-block">
                        <strong>🚀 Öne Çıkan Projeler:</strong><br>
                        1. <span class="term-highlight">Yapay Zeka Destekli Analitik SaaS Platformu</span> (Python + SQL + AI)<br>
                        2. <span class="term-highlight">Ölçeklenebilir Web Uygulamaları & Teknik SEO Altyapısı</span> (Core Web Vitals 100/100)<br>
                        3. <span class="term-highlight">Veri Görselleştirme & Yönetici Karar Destek Paneli</span> (Pandas + R Dashboard)
                    </div>`);
                    break;

                case 'contact':
                    this.printOutput(`
                    <div class="term-output-block">
                        <strong>📬 İletişim Kanalları:</strong><br>
                        • E-posta: <a href="mailto:altnydeniz@gmail.com" class="term-highlight">altnydeniz@gmail.com</a><br>
                        • LinkedIn: <a href="https://linkedin.com/in/deniz-altunay-424666388/" target="_blank" class="term-highlight">Deniz Altunay</a><br>
                        • GitHub : <a href="https://github.com/denisjpeg" target="_blank" class="term-highlight">github.com/denisjpeg</a><br>
                        • Instagram: <a href="https://instagram.com/denizaltny" target="_blank" class="term-highlight">@denizaltny</a>
                    </div>`);
                    break;

                case 'matrix':
                    this.printOutput(`<div class="term-output-block term-highlight">Matrix simülasyonu başlatılıyor... 🌧️</div>`);
                    setTimeout(() => {
                        this.matrixSim?.start();
                    }, 350);
                    break;

                case 'coffee':
                    this.printOutput(`
                    <pre class="term-output-block" style="color:#60a5fa; font-size:0.75rem;">
      )  (
     (   ) )
      ) ( (
    _______)_
 .-'---------|  Taze Filtre Kahveniz Hazır! ☕
( C|/\\/\\/\\/\\/|  Kod yazmaya ve verileri optimize etmeye devam!
 '-/________/
   '-------'
                    </pre>`);
                    break;

                case 'quote':
                    const quotes = [
                        '"Veri yeni petroldür, ancak işlenmediği sürece sadece ham bir yüktür." — Clive Humby',
                        '"Yapay zeka geleceği tahmin etmekle kalmaz, onu optimize eder." — Deniz Altunay',
                        '"Mükemmel kod, hiç yazılmamış olandır. En iyi sistem ise sıfır gecikmeyle çalışandır."',
                        '"In God we trust. All others must bring data." — W. Edwards Deming'
                    ];
                    const rand = quotes[Math.floor(Math.random() * quotes.length)];
                    this.printOutput(`<div class="term-output-block" style="font-style:italic;">💡 ${rand}</div>`);
                    break;

                case 'sudo hire':
                case 'hire':
                    this.printOutput(`
                    <div class="term-output-block" style="color:var(--accent-primary);">
                        🚀 <strong>İş birliği protokolü başlatılıyor.</strong><br>
                        Doğrudan iletişim için <a href="mailto:altnydeniz@gmail.com" style="text-decoration:underline;">altnydeniz@gmail.com</a> adresine yönlendiriliyorsunuz...
                    </div>`);
                    setTimeout(() => {
                        window.location.href = 'mailto:altnydeniz@gmail.com?subject=Kurumsal%20İş%20Birliği%20Teklifi';
                    }, 1200);
                    break;

                case 'clear':
                    this.clear();
                    return;

                default:
                    this.printOutput(`
                    <div class="term-output-block" style="color:#ef4444;">
                        Komut bulunamadı: <strong>${cmdStr}</strong>. Yardım için <span class="term-highlight">'help'</span> yazabilirsiniz.
                    </div>`);
                    break;
            }

            this.scrollToBottom();
        }

        printCommand(cmd) {
            const line = document.createElement('div');
            line.className = 'term-line';
            line.innerHTML = `<span class="term-prompt">deniz@terminal:~$</span> <span class="term-user-cmd">${this.escapeHTML(cmd)}</span>`;
            this.output.appendChild(line);
        }

        printOutput(html) {
            const div = document.createElement('div');
            div.innerHTML = html;
            this.output.appendChild(div);
        }

        clear() {
            this.output.innerHTML = `
                <div class="term-line term-welcome">⚡ Deniz Altunay Kurumsal Konsolu (Temizlendi)</div>
                <div class="term-line term-muted">Kullanılabilir komutlar için 'help' yazın.</div>
                <div class="term-divider"></div>
            `;
        }

        scrollToBottom() {
            this.output.scrollTop = this.output.scrollHeight;
        }

        escapeHTML(str) {
            return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
        }
    }

    // ==========================================
    // 10. TAB 2: VERİ AVCISI (MINI GAME)
    // ==========================================
    class DataCatcherGame {
        constructor() {
            this.canvas = document.getElementById('game-canvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.scoreEl = document.getElementById('game-score');
            this.highScoreEl = document.getElementById('game-high-score');
            this.livesEl = document.getElementById('game-lives');
            this.startBtn = document.getElementById('game-start-btn');
            this.btnText = document.getElementById('game-btn-text');
            this.overlay = document.getElementById('game-overlay');
            this.overlayPlayBtn = document.getElementById('overlay-play-btn');
            this.soundBtn = document.getElementById('game-sound-btn');

            this.score = 0;
            this.highScore = parseInt(localStorage.getItem('da_game_highscore') || '0', 10);
            this.lives = 3;
            this.isPlaying = false;
            this.soundEnabled = true;

            // Oyuncu Çubuğu (Paddle)
            this.paddle = {
                width: 110,
                height: 14,
                x: 0,
                y: 0,
                speed: 8,
                color: '#3b82f6'
            };

            // Düşen veri paketleri
            this.packets = [];
            this.keys = {};
            this.audioCtx = null;
            this.lastSpawn = 0;

            this.init();
        }

        init() {
            if (this.highScoreEl) this.highScoreEl.textContent = this.highScore;

            this.resize();
            window.addEventListener('resize', () => this.resize(), { passive: true });

            // Kontroller
            window.addEventListener('keydown', (e) => {
                if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) {
                    this.keys[e.key] = true;
                }
            });

            window.addEventListener('keyup', (e) => {
                if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) {
                    this.keys[e.key] = false;
                }
            });

            // Fare ve dokunmatik hareket
            this.canvas.addEventListener('mousemove', (e) => {
                if (!this.isPlaying) return;
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const mouseX = (e.clientX - rect.left) * scaleX;
                this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, mouseX - this.paddle.width / 2));
            });

            this.canvas.addEventListener('touchmove', (e) => {
                if (!this.isPlaying || !e.touches[0]) return;
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const touchX = (e.touches[0].clientX - rect.left) * scaleX;
                this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, touchX - this.paddle.width / 2));
                e.preventDefault();
            }, { passive: false });

            // Butonlar
            this.startBtn?.addEventListener('click', () => {
                if (this.isPlaying) this.stopGame();
                else this.startGame();
            });

            this.overlayPlayBtn?.addEventListener('click', () => {
                this.startGame();
            });

            this.soundBtn?.addEventListener('click', () => {
                this.soundEnabled = !this.soundEnabled;
                this.soundBtn.innerHTML = this.soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
                showToast(`Ses: ${this.soundEnabled ? 'Açık' : 'Kapalı'}`, 'volume-up');
            });
        }

        resize() {
            this.paddle.y = this.canvas.height - 24;
            this.paddle.x = (this.canvas.width - this.paddle.width) / 2;
        }

        playTone(freq, duration, type = 'sine') {
            if (!this.soundEnabled) return;
            try {
                if (!this.audioCtx) {
                    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
                gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start();
                osc.stop(this.audioCtx.currentTime + duration);
            } catch (e) {}
        }

        startGame() {
            this.score = 0;
            this.lives = 3;
            this.packets = [];
            this.isPlaying = true;
            this.updateLivesUI();
            if (this.scoreEl) this.scoreEl.textContent = '0';
            if (this.overlay) this.overlay.classList.add('hidden');
            if (this.btnText) this.btnText.textContent = 'Durdur';
            this.lastSpawn = performance.now();
            requestAnimationFrame((t) => this.loop(t));
            this.playTone(440, 0.15);
        }

        stopGame() {
            this.isPlaying = false;
            if (this.btnText) this.btnText.textContent = 'Tekrar Oyna';
            if (this.overlay) {
                this.overlay.classList.remove('hidden');
                const title = this.overlay.querySelector('.overlay-title');
                const desc = this.overlay.querySelector('.overlay-desc');
                if (title) title.textContent = 'Oyun Bitti!';
                if (desc) desc.innerHTML = `Toplam Skorunuz: <strong>${this.score}</strong><br>En Yüksek Skor: <strong>${this.highScore}</strong>`;
            }
        }

        updateLivesUI() {
            if (!this.livesEl) return;
            const hearts = this.livesEl.querySelectorAll('i');
            hearts.forEach((h, idx) => {
                if (idx < this.lives) h.classList.add('active');
                else h.classList.remove('active');
            });
        }

        spawnPacket() {
            const types = [
                { type: 'clean', color: '#3b82f6', text: 'DATA', pts: 10, radius: 14, speed: 2.8 },
                { type: 'ai', color: '#0ea5e9', text: 'AI', pts: 25, radius: 16, speed: 3.4 },
                { type: 'bug', color: '#ef4444', text: 'BUG', pts: -1, radius: 15, speed: 3.0 }
            ];

            const rand = Math.random();
            let chosen = types[0];
            if (rand > 0.75) chosen = types[1];
            else if (rand > 0.45) chosen = types[2];

            this.packets.push({
                x: Math.random() * (this.canvas.width - 40) + 20,
                y: -20,
                ...chosen
            });
        }

        loop(timestamp) {
            if (!this.isPlaying) return;

            // Klavye ile kontrol
            if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
                this.paddle.x = Math.max(0, this.paddle.x - this.paddle.speed);
            }
            if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
                this.paddle.x = Math.min(this.canvas.width - this.paddle.width, this.paddle.x + this.paddle.speed);
            }

            // Yeni paket üretme
            const spawnInterval = Math.max(700, 1400 - Math.floor(this.score / 50) * 80);
            if (timestamp - this.lastSpawn > spawnInterval) {
                this.spawnPacket();
                this.lastSpawn = timestamp;
            }

            // Canvas temizle
            this.ctx.fillStyle = '#07090e';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Izgara çizgileri
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            this.ctx.lineWidth = 1;
            for (let x = 0; x < this.canvas.width; x += 40) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }

            // Paddle çiz
            this.ctx.fillStyle = this.paddle.color;
            this.ctx.shadowColor = '#3b82f6';
            this.ctx.shadowBlur = 12;
            this.ctx.beginPath();
            this.ctx.roundRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height, 6);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            // Düşen paketleri güncelle & çiz
            for (let i = this.packets.length - 1; i >= 0; i--) {
                const p = this.packets[i];
                p.y += p.speed;

                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = 'bold 10px monospace';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(p.text, p.x, p.y);

                // Çarpışma kontrolü
                if (
                    p.y + p.radius >= this.paddle.y &&
                    p.y - p.radius <= this.paddle.y + this.paddle.height &&
                    p.x >= this.paddle.x &&
                    p.x <= this.paddle.x + this.paddle.width
                ) {
                    if (p.type === 'bug') {
                        this.lives--;
                        this.updateLivesUI();
                        this.playTone(180, 0.25, 'sawtooth');
                        if (this.lives <= 0) {
                            this.stopGame();
                            return;
                        }
                    } else {
                        this.score += p.pts;
                        if (this.scoreEl) this.scoreEl.textContent = this.score;
                        if (this.score > this.highScore) {
                            this.highScore = this.score;
                            localStorage.setItem('da_game_highscore', this.highScore);
                            if (this.highScoreEl) this.highScoreEl.textContent = this.highScore;
                        }
                        this.playTone(p.type === 'ai' ? 880 : 587, 0.12);
                    }
                    this.packets.splice(i, 1);
                    continue;
                }

                // Ekrandan düşenler
                if (p.y - p.radius > this.canvas.height) {
                    this.packets.splice(i, 1);
                }
            }

            requestAnimationFrame((t) => this.loop(t));
        }
    }

    // ==========================================
    // 11. TAB 3: CANLI K-MEANS KÜMELEME SİMÜLATÖRÜ
    // ==========================================
    class ClusteringSimulator {
        constructor() {
            this.canvas = document.getElementById('cluster-canvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.kSlider = document.getElementById('cluster-count');
            this.kDisplay = document.getElementById('k-val-display');
            this.pointsSlider = document.getElementById('point-count');
            this.pointsDisplay = document.getElementById('points-val-display');
            this.runBtn = document.getElementById('run-cluster-btn');
            this.resetBtn = document.getElementById('reset-cluster-btn');
            this.statusText = document.getElementById('cluster-status-text');

            this.k = 3;
            this.numPoints = 80;
            this.points = [];
            this.centroids = [];
            this.colors = ['#3b82f6', '#0ea5e9', '#6366f1', '#f59e0b', '#ec4899', '#10b981'];
            this.isRunning = false;

            this.init();
        }

        init() {
            this.kSlider?.addEventListener('input', (e) => {
                this.k = parseInt(e.target.value, 10);
                if (this.kDisplay) this.kDisplay.textContent = this.k;
                this.generateData();
            });

            this.pointsSlider?.addEventListener('input', (e) => {
                this.numPoints = parseInt(e.target.value, 10);
                if (this.pointsDisplay) this.pointsDisplay.textContent = this.numPoints;
                this.generateData();
            });

            this.resetBtn?.addEventListener('click', () => this.generateData());
            this.runBtn?.addEventListener('click', () => this.runKMeans());

            this.generateData();
        }

        generateData() {
            this.points = [];
            this.centroids = [];
            const w = this.canvas.width;
            const h = this.canvas.height;

            const centers = [];
            for (let i = 0; i < this.k; i++) {
                centers.push({
                    x: Math.random() * (w - 120) + 60,
                    y: Math.random() * (h - 120) + 60
                });
            }

            for (let i = 0; i < this.numPoints; i++) {
                const c = centers[i % this.k];
                const spread = 45;
                this.points.push({
                    x: Math.min(w - 10, Math.max(10, c.x + (Math.random() - 0.5) * spread * 2)),
                    y: Math.min(h - 10, Math.max(10, c.y + (Math.random() - 0.5) * spread * 2)),
                    cluster: -1
                });
            }

            for (let i = 0; i < this.k; i++) {
                this.centroids.push({
                    x: Math.random() * (w - 80) + 40,
                    y: Math.random() * (h - 80) + 40
                });
            }

            if (this.statusText) this.statusText.textContent = `${this.numPoints} veri noktası ve K=${this.k} merkez hazırlandı. 'Modeli Eğit' butonuna basın.`;
            this.draw();
        }

        runKMeans() {
            if (this.isRunning) return;
            this.isRunning = true;
            if (this.statusText) this.statusText.textContent = 'K-Means optimizasyonu çalışıyor... Yakınsama aranıyor.';

            let iteration = 0;
            const maxIter = 10;

            const step = () => {
                let changed = false;
                this.points.forEach(p => {
                    let minDist = Infinity;
                    let closest = -1;
                    this.centroids.forEach((c, idx) => {
                        const dist = Math.hypot(p.x - c.x, p.y - c.y);
                        if (dist < minDist) {
                            minDist = dist;
                            closest = idx;
                        }
                    });
                    if (p.cluster !== closest) {
                        p.cluster = closest;
                        changed = true;
                    }
                });

                for (let i = 0; i < this.k; i++) {
                    const clusterPts = this.points.filter(p => p.cluster === i);
                    if (clusterPts.length > 0) {
                        const avgX = clusterPts.reduce((acc, p) => acc + p.x, 0) / clusterPts.length;
                        const avgY = clusterPts.reduce((acc, p) => acc + p.y, 0) / clusterPts.length;
                        this.centroids[i].x = avgX;
                        this.centroids[i].y = avgY;
                    }
                }

                this.draw();
                iteration++;

                if (changed && iteration < maxIter) {
                    setTimeout(step, 250);
                } else {
                    this.isRunning = false;
                    if (this.statusText) {
                        this.statusText.textContent = `Model başarıyla eğitildi! ${iteration} iterasyonda tam yakınsama (convergence) sağlandı.`;
                    }
                    showToast('K-Means Algoritması Başarıyla Yakınsadı! 🎯', 'check-circle');
                }
            };

            step();
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = '#090b10';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.points.forEach(p => {
                const color = p.cluster === -1 ? '#64748b' : this.colors[p.cluster % this.colors.length];
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
                this.ctx.fillStyle = color;
                this.ctx.fill();

                if (p.cluster !== -1 && this.centroids[p.cluster]) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.centroids[p.cluster].x, this.centroids[p.cluster].y);
                    this.ctx.strokeStyle = `${color}25`;
                    this.ctx.lineWidth = 0.7;
                    this.ctx.stroke();
                }
            });

            this.centroids.forEach((c, idx) => {
                const color = this.colors[idx % this.colors.length];
                this.ctx.beginPath();
                this.ctx.arc(c.x, c.y, 9, 0, Math.PI * 2);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fill();
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 3;
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
                this.ctx.strokeStyle = `${color}66`;
                this.ctx.lineWidth = 1.5;
                this.ctx.stroke();
            });
        }
    }

    // ==========================================
    // 12. SAYFA BAŞLATMA (INIT APPLICATION)
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        const yearEl = document.getElementById('current-year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        new ThemeManager();
        new NavigationManager();
        new HeroEffects();
        new AmbientNetwork();
        const matrixSim = new MatrixSimulator();
        new PlaygroundTabs();
        new CyberTerminal(matrixSim);
        new DataCatcherGame();
        new ClusteringSimulator();
        initClipboardHandlers();

        console.log('🚀 Deniz Altunay Kurumsal Portfolyo başarıyla yüklendi!');
    });

})();