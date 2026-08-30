// Mobile Navigation Management & Scroll Hide/Show
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('main-nav');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && nav) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = nav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close when clicking a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (nav.classList.contains('is-open')) {
                    nav.classList.remove('is-open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('is-open') && !nav.contains(e.target)) {
                nav.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                nav.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });
    }

    // Mobile Horizontal Navbar Scroll Hide/Show
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let navScrollTicking = false;

    function updateMobileNavScroll() {
        const mainNav = document.getElementById('main-nav');
        if (!mainNav) {
            navScrollTicking = false;
            return;
        }

        if (window.innerWidth > 768) {
            // Keep desktop/laptop nav unchanged
            mainNav.classList.remove('nav-hidden');
            navScrollTicking = false;
            return;
        }

        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = currentScrollY - lastScrollY;

        // If near top of page, always keep visible
        if (currentScrollY <= 30) {
            mainNav.classList.remove('nav-hidden');
        } else if (scrollDelta > 6) {
            // Scrolling DOWN -> comes in view
            mainNav.classList.remove('nav-hidden');
        } else if (scrollDelta < -6) {
            // Scrolling UP -> hides
            mainNav.classList.add('nav-hidden');
        }

        lastScrollY = Math.max(0, currentScrollY);
        navScrollTicking = false;
    }

    window.addEventListener('scroll', function() {
        if (!navScrollTicking) {
            window.requestAnimationFrame(updateMobileNavScroll);
            navScrollTicking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const mainNav = document.getElementById('main-nav');
            if (mainNav) mainNav.classList.remove('nav-hidden');
        }
    });
});

// Project Tab Filtering System
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const projectItems = document.querySelectorAll('.project-item');
    const subtitle = document.getElementById('projects-subtitle');

    // Subtitle texts for each tab
    const subtitleTexts = {
        'web': 'Transforming algorithms into intelligent solutions',
        'mobile': 'Turning raw information into meaningful insights',
        'video': 'Proving skills through global challenges'
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-tab');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Update subtitle text with animation
            if (subtitle && subtitleTexts[filterValue]) {
                subtitle.style.opacity = '0';
                subtitle.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    subtitle.textContent = subtitleTexts[filterValue];
                    subtitle.style.opacity = '1';
                    subtitle.style.transform = 'translateY(0)';
                }, 200);
            }

            // Filter projects with animation
            projectItems.forEach((item, index) => {
                const itemCategory = item.getAttribute('data-category');
                
                if (itemCategory === filterValue) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.5s ease-out forwards';
                    item.style.animationDelay = `${index * 0.1}s`;
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
});

// Hero subtitle typing effect
document.addEventListener('DOMContentLoaded', function() {
    const typedEl = document.querySelector('.typed-text');
    if (!typedEl) {
        return;
    }

    const phrases = (typedEl.getAttribute('data-phrases') || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

    if (!phrases.length) {
        return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeSpeed = 80;
    const deleteSpeed = 50;
    const pauseAfterType = 1200;
    const pauseAfterDelete = 400;

    function tick() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            charIndex -= 1;
        } else {
            charIndex += 1;
        }

        typedEl.textContent = currentPhrase.slice(0, Math.max(charIndex, 0));

        let delay = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentPhrase.length) {
            delay = pauseAfterType;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            delay = pauseAfterDelete;
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }

        setTimeout(tick, delay);
    }

    tick();
});

// Smooth Scroll Navigation
const navLinks = document.querySelectorAll('.nav-link, .next-section a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Highlighting and Next Section UI
function updateActiveSection() {
    let current = '';
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 300) {
            current = section.getAttribute('id');
        }
    });

    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    const nextSections = document.querySelectorAll('.next-section');
    nextSections.forEach(item => item.classList.remove('is-active'));

    if (current) {
        const activeSection = document.getElementById(current);
        if (activeSection) {
            const activeNext = activeSection.querySelector('.next-section');
            if (activeNext) {
                activeNext.classList.add('is-active');
            }
        }
    }
}

// Parallel drift effect for section backgrounds
let driftTicking = false;
function updateParallelDrift() {
    if (window.innerWidth <= 768) return; // Skip heavy drift on small mobile devices
    const sections = document.querySelectorAll('.section');
    const scrollY = window.scrollY;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionMid = sectionTop + section.offsetHeight / 2;
        const delta = scrollY + window.innerHeight / 2 - sectionMid;
        const driftX = delta * 0.03;
        const driftY = delta * 0.01 + index * 6;

        section.style.setProperty('--drift-x', `${driftX}px`);
        section.style.setProperty('--drift-y', `${driftY}px`);
    });

    driftTicking = false;
}

function requestDriftUpdate() {
    if (!driftTicking) {
        window.requestAnimationFrame(updateParallelDrift);
        driftTicking = true;
    }
}

window.addEventListener('scroll', updateActiveSection);
window.addEventListener('load', updateActiveSection);
window.addEventListener('scroll', requestDriftUpdate);
window.addEventListener('load', updateParallelDrift);
window.addEventListener('resize', requestDriftUpdate);

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const fadeInObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Keep visible once revealed to eliminate scroll flicker
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.project-item, .lab-category, .code-block, .timeline-wrapper, .info-card, .timeline-step');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        el.style.transitionDelay = `${(index % 4) * 0.06}s`;
        fadeInObserver.observe(el);
    });
});

// Heading reveal animation (reveal once, no blur unblur loop)
const headingObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Keep visible and sharp once revealed
        }
    });
}, { threshold: 0.2 });

document.addEventListener('DOMContentLoaded', function() {
    const headings = document.querySelectorAll('.hero-title, .hero-subtitle, .section-title');
    headings.forEach(heading => {
        heading.classList.add('heading-reveal');
        headingObserver.observe(heading);
    });
});

// Section Collide Animation on Scroll (desktop only)
const sectionCollideObserver = new IntersectionObserver(function(entries) {
    if (window.innerWidth <= 860) return;
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('collide-animated')) {
            entry.target.classList.add('collide-animate');
            entry.target.classList.add('collide-animated');
            
            setTimeout(() => {
                entry.target.classList.remove('collide-animate');
            }, 600);
        }
    });
}, { threshold: 0.2 });

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        sectionCollideObserver.observe(section);
    });
});

// Project Spinner Animation Effect
document.addEventListener('DOMContentLoaded', function() {
    const spinners = document.querySelectorAll('.project-spinner');
    
    spinners.forEach(spinner => {
        setInterval(() => {
            spinner.style.opacity = Math.random() > 0.5 ? '1' : '0.5';
        }, 2000);
    });
});

// Parallax Effect for Hero Background
window.addEventListener('scroll', function() {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground && window.innerWidth > 1024) {
        const scrolled = window.pageYOffset;
        heroBackground.style.transform = `translateY(${scrolled * 0.4}px) scale(${1 + scrolled * 0.0001})`;
    }
});

// Circular Iris Animation for Hero Section (desktop only)
let irisAnimationTicking = false;

function updateIrisAnimation() {
    if (window.innerWidth <= 1024) return;
    const heroSection = document.querySelector('.hero-section');
    const aboutSection = document.querySelector('.about-section');
    
    if (!heroSection || !aboutSection) return;
    
    const heroTop = heroSection.offsetTop;
    const aboutTop = aboutSection.offsetTop;
    const scrollY = window.scrollY;
    
    // Start animation when scrolling begins, end when about section starts
    const startScroll = heroTop;
    const endScroll = aboutTop;
    
    const scrollProgress = Math.max(0, Math.min(1, (scrollY - startScroll) / (endScroll - startScroll)));
    
    // Circle starts at 150vw and contracts to 0vw
    const radius = 150 * (1 - scrollProgress);
    
    heroSection.style.setProperty('--circle-radius', `${radius}vw`);
    
    irisAnimationTicking = false;
}

function requestIrisUpdate() {
    if (!irisAnimationTicking) {
        window.requestAnimationFrame(updateIrisAnimation);
        irisAnimationTicking = true;
    }
}

window.addEventListener('scroll', requestIrisUpdate);
window.addEventListener('load', updateIrisAnimation);
window.addEventListener('resize', requestIrisUpdate);

// Cursor Trail Effect (desktop only)
let cursorTrail = [];
document.addEventListener('mousemove', function(e) {
    if (window.innerWidth > 1024) {
        cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        cursorTrail = cursorTrail.filter(point => Date.now() - point.time < 500);
    }
});

// Hover effect for project items
const projectItems = document.querySelectorAll('.project-item');
projectItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        if (window.innerWidth > 860) {
            this.style.filter = 'brightness(1.08)';
        }
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.filter = 'brightness(1)';
    });
});

// Keyboard Navigation Support
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
            return;
        }
        
        const sections = Array.from(document.querySelectorAll('.section'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= -50 && rect.top < window.innerHeight / 2;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            const targetIndex = event.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
            const targetSection = sections[targetIndex];
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

// CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(24px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

function updateLinePosition() {
    const page = document.querySelector('.page');
    const title = document.querySelector('.hero-title');
    if (!page || !title || window.innerWidth <= 480) {
        return;
    }

    const titleTop = title.getBoundingClientRect().top + window.scrollY;
    const lineTop = Math.max(0, titleTop - 80 - 6);
    page.style.setProperty('--line-top', `${lineTop}px`);
}

// Performance: Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('load', updateLinePosition);
window.addEventListener('resize', debounce(updateLinePosition, 100));

console.log('Portfolio v2.0 responsive loaded successfully! 🚀');
