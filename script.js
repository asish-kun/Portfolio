const langButtons = document.querySelectorAll('.lang');

langButtons.forEach(button => {
    button.addEventListener('click', () => {
        langButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        // You can expand this to actually switch language content if desired
        console.log(`Switched language to: ${button.dataset.lang}`);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const cards = track.querySelectorAll('.carousel-card');
    if (cards.length < 2) return;  // Need at least 2 cards

    const secondCard = cards[1];

    // Calculate how far to scroll so the second card is centered
    const offsetLeft = secondCard.offsetLeft
        - (track.offsetWidth / 2)
        + (secondCard.offsetWidth / 2);

    // Scroll there immediately (or smoothly)
    track.scrollTo({
        left: offsetLeft,
        behavior: 'smooth'  // or 'auto'
    });
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
        track.scrollBy({
            left: track.clientWidth / 2,
            behavior: 'smooth',
        });
    });

    leftArrow.addEventListener('click', () => {
        track.scrollBy({
            left: -track.clientWidth / 2,
            behavior: 'smooth',
        });
    });

    // Hide left arrow if at the beginning
    track.addEventListener('scroll', () => {
        leftArrow.style.display = track.scrollLeft > 10 ? 'block' : 'none';
        rightArrow.style.display = track.scrollLeft + track.clientWidth < track.scrollWidth - 10 ? 'block' : 'none';
    });

    // Initialize arrow visibility
    track.dispatchEvent(new Event('scroll'));
});

const ScrollManager = {
    init() {
        // Disable browser's automatic scroll restoration
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Save position before page unload
        window.addEventListener('beforeunload', () => {
            this.savePosition();
        });

        // Restore position when page fully loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.restorePosition();
            }, 300); // Slightly longer delay for layout stability
        });

        // Update position while scrolling (debounced)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.savePosition();
            }, 100);
        });

        this.addNavigationControls();
    },
    // Store multiple scroll positions with timestamps
    savePosition() {
        const currentPos = window.scrollY || window.pageYOffset;
        const timestamp = new Date().getTime();
        const scrollHistory = JSON.parse(localStorage.getItem('scrollHistory') || '[]');

        // Keep only last 5 positions
        scrollHistory.push({ position: currentPos, timestamp });
        if (scrollHistory.length > 5) scrollHistory.shift();

        localStorage.setItem('scrollHistory', JSON.stringify(scrollHistory));
        console.log('Saved position:', currentPos);
    },

    restorePosition() {
        const scrollHistory = JSON.parse(localStorage.getItem('scrollHistory') || '[]');
        if (scrollHistory.length === 0) return;

        const lastPosition = scrollHistory[scrollHistory.length - 1].position;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        // Ensure the saved position is within valid bounds
        const validPosition = Math.min(lastPosition, maxScroll);

        // Use 'auto' behavior for immediate scroll
        window.scrollTo({
            top: parseInt(validPosition),
            behavior: 'auto' // Changed from 'smooth' to prevent conflicts
        });
    },

    // Add keyboard shortcuts and navigation controls
    addNavigationControls() {
        // Keyboard shortcuts
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

        // Create scroll to top button
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background: #000;
            color: #fff;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 1000;
        `;

        document.body.appendChild(scrollTopBtn);

        // Show/hide scroll to top button
        window.addEventListener('scroll', () => {
            scrollTopBtn.style.opacity = window.scrollY > 500 ? '1' : '0';
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

// Initialize the scroll manager
ScrollManager.init();

