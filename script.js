// ============================================================
// ASISH NELAPATI — PORTFOLIO
// Vanilla JS: smooth scroll, reveals, parallax, cursor, rotator
// ============================================================

(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // ---------- Hero title: split lines into letters ----------
    const heroTitle = document.querySelector('.hero-title');
    const contactTitle = document.querySelector('.contact-title');

    if (!reduceMotion) {
        document.querySelectorAll('.hero-title .hero-line-inner').forEach((line) => {
            const text = line.textContent;
            line.classList.add('split');
            line.textContent = '';
            [...text].forEach((ch, i) => {
                const s = document.createElement('span');
                s.className = 'ltr';
                s.style.setProperty('--i', i);
                s.textContent = ch === ' ' ? ' ' : ch;
                s.setAttribute('aria-hidden', 'true');
                line.appendChild(s);
            });
        });
    }

    // ---------- Scramble/decode effect ----------
    const GLYPHS = '#/<>[]{}=+*^?_—01';
    const scramble = (el) => {
        if (reduceMotion || el.dataset.decoded) return;
        el.dataset.decoded = '1';
        const finalText = el.textContent;
        const t0 = performance.now();
        const dur = 650;
        // Guarantee the readable text lands even if frames stop
        // (backgrounded tab, throttled renderer) mid-animation.
        const settle = setTimeout(() => { el.textContent = finalText; }, dur + 400);
        const tick = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            const settled = Math.floor(finalText.length * p);
            el.textContent = [...finalText].map((ch, i) => {
                if (i < settled || ch === ' ') return ch;
                return GLYPHS[(Math.random() * GLYPHS.length) | 0];
            }).join('');
            if (p < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = finalText;
                clearTimeout(settle);
            }
        };
        requestAnimationFrame(tick);
    };

    // ---------- Preloader ----------
    const preloader = document.getElementById('preloader');

    const startPage = () => {
        preloader.classList.add('done');
        requestAnimationFrame(() => heroTitle.classList.add('lines-in'));
    };

    if (reduceMotion || sessionStorage.getItem('seen')) {
        preloader.style.display = 'none';
        heroTitle.classList.add('lines-in');
    } else {
        sessionStorage.setItem('seen', '1');
        window.addEventListener('load', () => setTimeout(startPage, 1450));
        // Fallback in case load stalls (slow video poster etc.)
        setTimeout(startPage, 3000);
    }

    // ---------- Smooth momentum scroll (desktop wheel only) ----------
    // Virtual target drives window.scrollTo via lerp; native behaviour is
    // kept for touch, keyboard, and reduced-motion users.
    if (finePointer && !reduceMotion) {
        let target = window.scrollY;
        let current = window.scrollY;
        let raf = null;

        const maxScroll = () =>
            document.documentElement.scrollHeight - window.innerHeight;

        const loop = () => {
            // If something else moved the page (keyboard, hash jump,
            // scripts), adopt that position and cancel the glide.
            if (Math.abs(window.scrollY - current) > 2) {
                current = window.scrollY;
                target = current;
                raf = null;
                return;
            }
            current += (target - current) * 0.11;
            if (Math.abs(target - current) < 0.5) {
                current = target;
                raf = null;
            } else {
                raf = requestAnimationFrame(loop);
            }
            window.scrollTo({ top: current, behavior: 'instant' });
        };

        const kick = () => {
            if (!raf) raf = requestAnimationFrame(loop);
        };

        window.addEventListener('wheel', (e) => {
            if (e.ctrlKey) return; // pinch-zoom
            e.preventDefault();
            target = Math.max(0, Math.min(maxScroll(), target + e.deltaY));
            kick();
        }, { passive: false });

        // Resync when scrolling happens outside the wheel path
        // (keyboard, anchor jumps, find-in-page).
        window.addEventListener('scroll', () => {
            if (!raf) {
                target = window.scrollY;
                current = window.scrollY;
            }
        }, { passive: true });

        // Anchor links glide through the same pipeline.
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
            a.addEventListener('click', (e) => {
                const el = document.querySelector(a.getAttribute('href'));
                if (!el) return;
                e.preventDefault();
                target = Math.min(maxScroll(),
                    el.getBoundingClientRect().top + window.scrollY - 70);
                kick();
                document.body.classList.remove('menu-open');
                burger?.setAttribute('aria-expanded', 'false');
            });
        });
    } else {
        // Native smooth scroll still needs the menu to close on tap.
        document.querySelectorAll('.menu-link, .nav-link').forEach((a) => {
            a.addEventListener('click', () => {
                document.body.classList.remove('menu-open');
                burger?.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---------- Nav ----------
    const nav = document.getElementById('nav');
    const burger = document.getElementById('navBurger');

    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    burger.addEventListener('click', () => {
        const open = document.body.classList.toggle('menu-open');
        burger.setAttribute('aria-expanded', String(open));
        document.getElementById('menuOverlay')
            .setAttribute('aria-hidden', String(!open));
    });

    // Active section highlight
    const navLinks = [...document.querySelectorAll('.nav-link')];
    const sections = navLinks
        .map((l) => document.querySelector(l.getAttribute('href')))
        .filter(Boolean);

    const sectionSpy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((l) => l.classList.toggle('active',
                l.getAttribute('href') === `#${entry.target.id}`));
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach((s) => sectionSpy.observe(s));

    // ---------- Reveals ----------
    const revealer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                entry.target.querySelectorAll('.scramble').forEach(scramble);
                if (entry.target.matches('.scramble')) scramble(entry.target);
                revealer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18, rootMargin: '0px 0px -5% 0px' });

    document.querySelectorAll('[data-reveal]').forEach((el) => revealer.observe(el));

    // Contact title line reveal
    if (contactTitle) {
        const titleObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    contactTitle.classList.add('lines-in');
                    titleObs.disconnect();
                }
            });
        }, { threshold: 0.4 });
        titleObs.observe(contactTitle);
    }

    // ---------- Hero word rotator ----------
    const rotator = document.getElementById('rotatorWord');
    const words = ['AI agents', 'search systems', 'data pipelines', 'mobile apps'];
    let wordIdx = 0;

    if (rotator && !reduceMotion) {
        const holder = rotator.parentElement; // .hero-rotator
        // Reserve the widest word once so the trailing text never shifts
        // or collides as words swap.
        const setWidth = () => {
            const probe = rotator.cloneNode(true);
            probe.style.cssText =
                'position:absolute;visibility:hidden;white-space:nowrap;';
            holder.appendChild(probe);
            let max = 0;
            words.forEach((w) => {
                probe.textContent = w;
                max = Math.max(max, probe.getBoundingClientRect().width);
            });
            probe.remove();
            holder.style.width = `${Math.ceil(max)}px`;
        };
        if (document.fonts?.ready) {
            document.fonts.ready.then(setWidth);
        } else {
            setWidth();
        }
        window.addEventListener('resize', setWidth);

        setInterval(() => {
            rotator.classList.add('swap-out');
            setTimeout(() => {
                wordIdx = (wordIdx + 1) % words.length;
                rotator.textContent = words[wordIdx];
                rotator.classList.remove('swap-out');
                rotator.classList.add('swap-in');
                setWidth();
                setTimeout(() => rotator.classList.remove('swap-in'), 380);
            }, 280);
        }, 2600);
    }

    // ---------- Stat counters ----------
    const counters = document.querySelectorAll('[data-count]');
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            counterObs.unobserve(el);
            const end = parseInt(el.dataset.count, 10);
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            if (reduceMotion) {
                el.innerHTML = prefix + end + suffix;
                return;
            }
            const t0 = performance.now();
            const dur = 1300;
            // Same guarantee as the decode effect: the real number must
            // land even if animation frames stop partway through.
            const settle = setTimeout(() => {
                el.innerHTML = prefix + end + suffix;
            }, dur + 400);
            const tick = (t) => {
                const p = Math.min(1, (t - t0) / dur);
                const eased = 1 - Math.pow(1 - p, 4);
                el.innerHTML = prefix + Math.round(end * eased) + suffix;
                if (p < 1) requestAnimationFrame(tick);
                else clearTimeout(settle);
            };
            requestAnimationFrame(tick);
        });
    }, { threshold: 0.6 });
    counters.forEach((c) => counterObs.observe(c));

    // ---------- Parallax ----------
    const parallaxEls = [...document.querySelectorAll('[data-parallax]')];
    if (parallaxEls.length && !reduceMotion) {
        let ticking = false;
        const applyParallax = () => {
            ticking = false;
            const vh = window.innerHeight;
            parallaxEls.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > vh) return;
                const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
                const depth = parseFloat(el.dataset.parallax);
                el.style.transform = `translateY(${(progress * depth).toFixed(2)}px)`;
            });
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(applyParallax);
            }
        }, { passive: true });
        applyParallax();
    }

    // ---------- Email button: copy to clipboard with feedback ----------
    // mailto: silently does nothing on machines without a mail client,
    // so the click copies the address instead.
    const emailBtn = document.getElementById('emailBtn');
    const emailBtnText = document.getElementById('emailBtnText');
    if (emailBtn) {
        const EMAIL = 'asish.nelapati@gmail.com';
        let resetTimer = null;

        const showCopied = () => {
            emailBtnText.textContent = 'Copied to clipboard ✓';
            emailBtn.classList.add('copied');
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                emailBtnText.textContent = EMAIL;
                emailBtn.classList.remove('copied');
            }, 1800);
        };

        const legacyCopy = () => {
            const ta = document.createElement('textarea');
            ta.value = EMAIL;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch { /* noop */ }
            ta.remove();
            return ok;
        };

        emailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (navigator.clipboard?.writeText) {
                navigator.clipboard.writeText(EMAIL).then(showCopied).catch(() => {
                    if (legacyCopy()) showCopied();
                    else window.location.href = `mailto:${EMAIL}`;
                });
            } else if (legacyCopy()) {
                showCopied();
            } else {
                window.location.href = `mailto:${EMAIL}`;
            }
        });
    }

    // ---------- Note form ----------
    // Static host, so submissions relay through FormSubmit. If that
    // request fails for any reason, hand the note off to the mail client
    // rather than losing what the visitor typed.
    const noteForm = document.getElementById('noteForm');
    if (noteForm) {
        const msgEl = document.getElementById('noteMsg');
        const fromEl = document.getElementById('noteFrom');
        const sendBtn = document.getElementById('noteSend');
        const statusEl = document.getElementById('noteStatus');
        const ENDPOINT = 'https://formsubmit.co/ajax/asish.nelapati@gmail.com';

        const setStatus = (text, kind) => {
            statusEl.textContent = text;
            statusEl.className = `note-status${kind ? ' ' + kind : ''}`;
        };

        const mailtoFallback = (message, from) => {
            const body = encodeURIComponent(`${message}\n\n— ${from}`);
            window.location.href =
                `mailto:asish.nelapati@gmail.com?subject=${
                    encodeURIComponent('Note from your portfolio')}&body=${body}`;
        };

        noteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = msgEl.value.trim();
            const from = fromEl.value.trim();

            msgEl.classList.toggle('invalid', !message);
            fromEl.classList.toggle('invalid', !fromEl.checkValidity() || !from);

            if (!message) {
                setStatus('Add a note first.', 'err');
                msgEl.focus();
                return;
            }
            if (!from || !fromEl.checkValidity()) {
                setStatus('Need a valid email so I can reply.', 'err');
                fromEl.focus();
                return;
            }
            if (noteForm.querySelector('[name="_honey"]').value) return; // bot

            sendBtn.disabled = true;
            setStatus('Sending…');

            try {
                const res = await fetch(ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        email: from,
                        message,
                        _subject: 'Note from your portfolio',
                    }),
                });
                if (!res.ok) throw new Error(res.status);
                noteForm.reset();
                setStatus('Sent — thanks, I\'ll get back to you soon.', 'ok');
            } catch {
                setStatus('Couldn\'t send from here — opening your mail app…', 'err');
                mailtoFallback(message, from);
            } finally {
                sendBtn.disabled = false;
            }
        });

        [msgEl, fromEl].forEach((el) => {
            el.addEventListener('input', () => {
                el.classList.remove('invalid');
                if (statusEl.classList.contains('err')) setStatus('');
            });
        });
    }

    // ---------- Kaana video: play only when visible ----------
    const video = document.getElementById('kaanaVideo');
    if (video) {
        const videoObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => { /* autoplay blocked — poster stays */ });
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.35 });
        videoObs.observe(video);
    }

    // ---------- Custom cursor + magnetic buttons (desktop) ----------
    if (finePointer && !reduceMotion) {
        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        let mx = -100, my = -100, rx = -100, ry = -100;

        window.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = `${mx}px`;
            dot.style.top = `${my}px`;
        }, { passive: true });

        // Trailing blob squashes along its direction of travel —
        // fast flicks stretch it, settling relaxes it back to a circle.
        const ringLoop = () => {
            const dx = mx - rx;
            const dy = my - ry;
            rx += dx * 0.16;
            ry += dy * 0.16;
            const speed = Math.min(Math.hypot(dx, dy), 120);
            const stretch = 1 + speed * 0.004;
            const angle = Math.atan2(dy, dx);
            ring.style.left = `${rx}px`;
            ring.style.top = `${ry}px`;
            ring.style.transform =
                `translate(-50%, -50%) rotate(${angle}rad) ` +
                `scale(${stretch}, ${1 / stretch})`;
            requestAnimationFrame(ringLoop);
        };
        ringLoop();

        document.querySelectorAll('[data-hover]').forEach((el) => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
        });

        document.querySelectorAll('[data-magnetic]').forEach((el) => {
            el.addEventListener('mousemove', (e) => {
                const r = el.getBoundingClientRect();
                const dx = e.clientX - (r.left + r.width / 2);
                const dy = e.clientY - (r.top + r.height / 2);
                el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.28}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }
})();
