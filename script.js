document.addEventListener('DOMContentLoaded', () => {
    initUI();
    initTestimonialSlider();
});

// =========================================
// UI LOGIC
// =========================================
function initUI() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-xmark');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });

    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        toast.className = "toast show";
        contactForm.reset();
        setTimeout(() => {
            toast.className = toast.className.replace("show", "");
        }, 3000);
    });

    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
}

// =========================================
// TESTIMONIAL HORIZONTAL SLIDER
// =========================================
function initTestimonialSlider() {
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialDots');

    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    const totalCards = cards.length;
    let current = 0;

    function getVisible() {
        if (window.innerWidth <= 600) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        const visible = getVisible();
        const totalPages = Math.ceil(totalCards / visible);
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Page ' + (i + 1));
            dot.addEventListener('click', () => goTo(i * visible));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const visible = getVisible();
        const dots = dotsContainer.querySelectorAll('.dot');
        const activePage = Math.round(current / visible);
        dots.forEach((dot, i) => dot.classList.toggle('active', i === activePage));
    }

    function goTo(index) {
        const visible = getVisible();
        const maxIndex = Math.max(0, totalCards - visible);
        current = Math.max(0, Math.min(index, maxIndex));

        const gap = 24;
        const trackWidth = track.offsetWidth;
        const cardWidth = (trackWidth - gap * (visible - 1)) / visible;
        const offset = current * (cardWidth + gap);

        track.style.transform = 'translateX(-' + offset + 'px)';
        updateDots();
        updateNavButtons();
    }

    function updateNavButtons() {
        const visible = getVisible();
        const atStart = current === 0;
        const atEnd = current >= totalCards - visible;
        prevBtn.style.opacity = atStart ? '0.35' : '1';
        prevBtn.disabled = atStart;
        nextBtn.style.opacity = atEnd ? '0.35' : '1';
        nextBtn.disabled = atEnd;
    }

    prevBtn.addEventListener('click', () => goTo(current - getVisible()));
    nextBtn.addEventListener('click', () => goTo(current + getVisible()));

    track.style.transition = 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';

    window.addEventListener('resize', () => {
        current = 0;
        buildDots();
        goTo(0);
    });

    buildDots();
    goTo(0);
}
