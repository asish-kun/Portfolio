// ==========================================
// MODERN 2025 PORTFOLIO - JavaScript
// ==========================================

const langButtons = document.querySelectorAll('.lang');

langButtons.forEach(button => {
    button.addEventListener('click', () => {
        langButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        console.log(`Switched language to: ${button.dataset.lang}`);
    });
});

// ==========================================
// DYNAMIC BACKGROUND CIRCLES - Parallax
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const circles = document.querySelectorAll('.dynamic-circle');
    let ticking = false;
    let lastScrollY = 0;

    function updateCirclePositions() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const scrollProgress = scrollY / (document.documentElement.scrollHeight - windowHeight);

        circles.forEach((circle, index) => {
            const speed = (index + 1) * 0.05;
            const direction = index % 2 === 0 ? 1 : -1;
            const rotation = scrollY * 0.02 * direction;
            const translateY = scrollY * speed * direction;
            const translateX = Math.sin(scrollProgress * Math.PI * 2) * 30 * (index + 1);
            const scale = 1 + Math.sin(scrollProgress * Math.PI) * 0.1;

            circle.style.transform = `
                translateY(${translateY}px) 
                translateX(${translateX}px) 
                rotate(${rotation}deg) 
                scale(${scale})
            `;

            // Adjust opacity based on scroll
            const opacity = 0.8 + Math.sin(scrollProgress * Math.PI * 2) * 0.2;
            circle.style.opacity = opacity;
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateCirclePositions();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial position
    updateCirclePositions();
});

// ==========================================
// HEADER SCROLL EFFECT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

// ==========================================
// INTERSECTION OBSERVER - Reveal Animations
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Stagger children animations
                const children = entry.target.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    child.style.animationDelay = `${index * 0.1}s`;
                    child.classList.add('active');
                });
            }
        });
    }, observerOptions);

    // Observe elements
    const revealElements = document.querySelectorAll(
        '.project-title, .project-subtitle, .tech-stack-grid, .project-description, ' +
        '.skill-card, .timeline-item, .showcase-item, .section-title, ' +
        '.kaana-highlights, .highlight-item'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
});

// ==========================================
// CAROUSEL - Start at first card (Kaana)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const cards = track.querySelectorAll('.carousel-card');
    if (cards.length < 1) return;

    // Start at the first card (Kaana) instead of second
    const firstCard = cards[0];

    const offsetLeft = firstCard.offsetLeft
        - (track.offsetWidth / 2)
        + (firstCard.offsetWidth / 2);

    // Scroll there after a small delay for smooth load
    setTimeout(() => {
    track.scrollTo({
        left: offsetLeft,
            behavior: 'smooth'
    });
    }, 300);
});

//Nav Links OnCLick Functionality
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const header = document.querySelector('.main-header');
    const headerHeight = header ? header.offsetHeight : 0;

    // Add scroll-margin-top to all sections to account for header
    document.querySelectorAll('section[id]').forEach(section => {
        section.style.scrollMarginTop = `${headerHeight}px`;
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});


// 3D carousel effects
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(document.querySelectorAll('.carousel-card'));

    if (!track || cards.length === 0) return;

    track.addEventListener('scroll', update3DEffects);
    window.addEventListener('resize', update3DEffects);

    update3DEffects();


    function update3DEffects() {
        // Find center X of the carousel track in viewport coords
        const trackRect = track.getBoundingClientRect();
        const centerX = trackRect.left + trackRect.width / 2;

        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            // Card center in viewport coords
            const cardCenter = cardRect.left + cardRect.width / 2;
            // Distance from carousel center (negative = left, positive = right)
            const offset = centerX - cardCenter;
            // Normalize by track width for a more stable effect
            const offsetNorm = offset / trackRect.width;

            // Example: rotate up to +/- 30 deg, scale between 0.8 and 1
            const rotation = offsetNorm * 30;
            const scale = Math.max(0.8, 1 - Math.abs(offsetNorm));

            // Optional fade-out if far from center
            const opacity = 1 - Math.min(Math.abs(offsetNorm) * 0.7, 0.7);

            card.style.transform = `
          perspective(1000px) 
          translateZ(0) 
          rotateY(${rotation}deg) 
          scale(${scale})
        `;
            card.style.opacity = opacity;
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const pageNumbers = document.querySelectorAll('.page-number');
    const articleCards = document.querySelectorAll('.article-card');
    const upArrow = document.querySelector('.up-arrow');
    const downArrow = document.querySelector('.down-arrow');

    let currentPage = 1;

    function switchToPage(pageNumber) {
        pageNumbers.forEach((num, index) => {
            num.classList.toggle('active', index + 1 === pageNumber);
        });

        articleCards.forEach(card => {
            card.style.visibility = card.dataset.page === String(pageNumber) ? 'visible' : 'hidden';
            card.style.position = card.dataset.page === String(pageNumber) ? 'relative' : 'absolute';
        });

        upArrow.classList.toggle('hidden', pageNumber === 1);
        downArrow.classList.toggle('hidden', pageNumber === pageNumbers.length);
    }

    pageNumbers.forEach((num, index) => {
        num.addEventListener('click', () => {
            currentPage = index + 1;
            switchToPage(currentPage);
        });
    });

    upArrow.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            switchToPage(currentPage);
        }
    });

    downArrow.addEventListener('click', () => {
        if (currentPage < pageNumbers.length) {
            currentPage++;
            switchToPage(currentPage);
        }
    });

    switchToPage(currentPage);
});

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    if (!track || !leftArrow || !rightArrow) return;

    rightArrow.addEventListener('click', () => {
        const cardWidth = track.querySelector('.carousel-card').offsetWidth;
        const gap = 32; // 2rem gap
        track.scrollBy({
            left: cardWidth + gap,
            behavior: 'smooth',
        });
    });

    leftArrow.addEventListener('click', () => {
        const cardWidth = track.querySelector('.carousel-card').offsetWidth;
        const gap = 32; // 2rem gap
        track.scrollBy({
            left: -(cardWidth + gap),
            behavior: 'smooth',
        });
    });

    // Hide left arrow if at the beginning
    track.addEventListener('scroll', () => {
        const scrollLeft = track.scrollLeft;
        const scrollWidth = track.scrollWidth;
        const clientWidth = track.clientWidth;
        const threshold = 5; // Small threshold for edge detection
        
        leftArrow.style.display = scrollLeft > threshold ? 'block' : 'none';
        // Check if we're at the end (accounting for padding)
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - threshold;
        rightArrow.style.display = isAtEnd ? 'none' : 'block';
    });

    // Initialize arrow visibility
    track.dispatchEvent(new Event('scroll'));
});

// ==========================================
// CURSOR GLOW EFFECT - Modern 2025
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('active');
    });

    // Smooth follow animation
    function animateCursor() {
        const ease = 0.15;
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;
        
        cursorGlow.style.left = currentX + 'px';
        cursorGlow.style.top = currentY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
});

// ==========================================
// SCROLL MANAGER - Enhanced 2025
// ==========================================
const ScrollManager = {
    init() {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        window.addEventListener('beforeunload', () => {
            this.savePosition();
        });

        window.addEventListener('load', () => {
            setTimeout(() => {
                this.restorePosition();
            }, 300);
        });

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.savePosition();
            }, 100);
        });

        this.addNavigationControls();
    },

    savePosition() {
        const currentPos = window.scrollY || window.pageYOffset;
        const timestamp = new Date().getTime();
        const scrollHistory = JSON.parse(localStorage.getItem('scrollHistory') || '[]');

        scrollHistory.push({ position: currentPos, timestamp });
        if (scrollHistory.length > 5) scrollHistory.shift();

        localStorage.setItem('scrollHistory', JSON.stringify(scrollHistory));
    },

    restorePosition() {
        const scrollHistory = JSON.parse(localStorage.getItem('scrollHistory') || '[]');
        if (scrollHistory.length === 0) return;

        const lastPosition = scrollHistory[scrollHistory.length - 1].position;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const validPosition = Math.min(lastPosition, maxScroll);

        window.scrollTo({
            top: parseInt(validPosition),
            behavior: 'auto'
        });
    },

    addNavigationControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (e.key === 'End') {
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth'
                });
            }
        });

        // Modern scroll to top button
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.className = 'scroll-top-btn';
        document.body.appendChild(scrollTopBtn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

ScrollManager.init();

// ==========================================
// SMOOTH COUNTER ANIMATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.highlight-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.innerText;
                
                // Only animate if it's a number
                if (!isNaN(parseInt(text))) {
                    const endValue = parseInt(text);
                    let startValue = 0;
                    const duration = 2000;
                    const increment = endValue / (duration / 16);
                    
                    const counter = setInterval(() => {
                        startValue += increment;
                        if (startValue >= endValue) {
                            target.innerText = text; // Restore original text (with % if present)
                            clearInterval(counter);
                        } else {
                            target.innerText = Math.floor(startValue) + (text.includes('%') ? '%' : '');
                        }
                    }, 16);
                }
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
});

// ==========================================
// MAGNETIC BUTTONS EFFECT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const magneticBtns = document.querySelectorAll('.projects-btn, .arrow-btn, .app-store-btn, .read-more');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // Select ALL project images, including the first project
    const projectImages = document.querySelectorAll('.showcase-item img');
    // Also include Kaana work showcase images
    const kaanaWorkImages = document.querySelectorAll('.kaana-showcase-item img');
    const viewer = document.getElementById('imageViewer');
    const fullscreenImg = viewer.querySelector('.fullscreen-image');
    const closeBtn = viewer.querySelector('.viewer-close-btn');
    const prevArrow = viewer.querySelector('.prev-arrow');
    const nextArrow = viewer.querySelector('.next-arrow');

    let currentImageIndex = 0;
    let currentProjectImages = [];

    // Function to handle image click
    function handleImageClick(e, imagesArray) {
        currentProjectImages = imagesArray;
        currentImageIndex = currentProjectImages.indexOf(e.target);
        openImageViewer(e.target.src);
    }

    // Add click listeners to all project images
    projectImages.forEach(img => {
        img.addEventListener('click', (e) => {
            // Find all images in the current project's showcase
            const projectSection = e.target.closest('.project-container-right, .project-container-left');
            const images = Array.from(projectSection.querySelectorAll('.showcase-item img'));
            handleImageClick(e, images);
        });
    });

    // Add click listeners to Kaana work showcase images
    kaanaWorkImages.forEach(img => {
        img.addEventListener('click', (e) => {
            // Get all Kaana work showcase images
            const kaanaSection = e.target.closest('.kaana-work-showcase');
            const images = Array.from(kaanaSection.querySelectorAll('.kaana-showcase-item img'));
            handleImageClick(e, images);
        });
    });

    function openImageViewer(src) {
        fullscreenImg.src = src;
        viewer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeImageViewer() {
        viewer.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function navigate(direction) {
        currentImageIndex = (currentImageIndex + direction + currentProjectImages.length) % currentProjectImages.length;
        fullscreenImg.src = currentProjectImages[currentImageIndex].src;
    }

    // Event Listeners
    closeBtn.addEventListener('click', closeImageViewer);
    viewer.addEventListener('click', (e) => {
        if (e.target === viewer) closeImageViewer();
    });

    prevArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(-1);
    });

    nextArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(1);
    });

    // Keyboard navigation
    document.addEventListener('keyup', (e) => {
        if (viewer.style.display === 'flex') {
            if (e.key === 'Escape') closeImageViewer();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Select both nav links and the projects button
    const navLinks = document.querySelectorAll('.nav-links a, .projects-btn, .arrow-btn, .read-more[href^="#"]');
    const header = document.querySelector('.main-header');
    const headerHeight = header ? header.offsetHeight : 0;

    // Add scroll-margin-top to all sections to account for header
    document.querySelectorAll('section[id]').forEach(section => {
        section.style.scrollMarginTop = `${headerHeight}px`;
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Get target ID from href for nav links or data-target for button
            const targetId = this.getAttribute('href') || this.dataset.target;
            if (!targetId || !targetId.startsWith('#')) return;

            e.preventDefault();
            const targetSection = document.getElementById(targetId.substring(1));
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// ==========================================
// TILT EFFECT FOR PROJECT CARDS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const showcaseItems = document.querySelectorAll('.showcase-item');
    
    showcaseItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const tiltX = (y - 0.5) * 10;
            const tiltY = (x - 0.5) * -10;
            
            item.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
});