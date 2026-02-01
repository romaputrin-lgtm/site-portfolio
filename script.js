// ===== Header Scroll Effect =====
const header = document.getElementById('header');

function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);

// ===== Mobile Menu =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('nav');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking on a link
nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Scroll Animations =====
const sections = document.querySelectorAll('.section');

const observerOptions = {
    root: null,
    rootMargin: '-100px 0px',
    threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// ===== Portfolio Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        // Filter cards
        portfolioCards.forEach(card => {
            const category = card.dataset.category;

            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});


// ===== Active Navigation Highlight =====
const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-accent)');
const sectionIds = ['about', 'services', 'portfolio', 'projects', 'testimonials', 'contact'];

function updateActiveNav() {
    const scrollPosition = window.scrollY + header.offsetHeight + 100;

    sectionIds.forEach((sectionId, index) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLinks[index]) {
                    navLinks[index].classList.add('active');
                }
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== Parallax Effect for Hero =====
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-image-wrapper');

window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) {
        const scrolled = window.scrollY;
        if (scrolled < hero.offsetHeight) {
            heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
        }
    }
});

// ===== Service Cards Stagger Animation =====
const serviceCards = document.querySelectorAll('.service-card');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.2 });

serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
});


// ===== Portfolio Cards Animation =====
portfolioCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

const portfolioObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const cardIndex = Array.from(portfolioCards).indexOf(entry.target);
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, (cardIndex % 3) * 100);
        }
    });
}, { threshold: 0.2 });

portfolioCards.forEach(card => {
    portfolioObserver.observe(card);
});

// ===== Stat Counter Animation =====
const statNumbers = document.querySelectorAll('.stat-number');

const countUp = (element, target) => {
    const isPercentage = target.includes('%');
    const isTime = target.includes('/');

    if (isTime) {
        element.textContent = target;
        return;
    }

    const numericValue = parseInt(target.replace(/\D/g, ''));
    const suffix = target.replace(/[0-9]/g, '');
    let current = 0;
    const increment = numericValue / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 30);
};

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target.textContent;
            countUp(entry.target, target);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statObserver.observe(stat);
});

// ===== Portfolio Modal System =====
const imageModal = document.getElementById('imageModal');
const documentModal = document.getElementById('documentModal');
const modalImage = document.getElementById('modalImage');
const imageModalTitle = document.getElementById('imageModalTitle');
const documentModalTitle = document.getElementById('documentModalTitle');
const documentFrame = document.getElementById('documentFrame');
const documentLoader = document.getElementById('documentLoader');
const documentFallback = document.getElementById('documentFallback');
const downloadBtn = document.getElementById('downloadBtn');
const fallbackDownloadBtn = document.getElementById('fallbackDownloadBtn');

// Check if running locally (localhost or file://)
const isLocalhost = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.protocol === 'file:';

// Portfolio card click handler
portfolioCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        const type = card.dataset.type;
        const file = card.dataset.file;
        const title = card.querySelector('.portfolio-title').textContent;

        if (type === 'image') {
            openImageModal(file, title);
        } else if (type === 'document') {
            openDocumentModal(file, title);
        }
    });
});

// Open image modal
function openImageModal(src, title) {
    modalImage.src = src;
    modalImage.alt = title;
    imageModalTitle.textContent = title;
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Open document modal
function openDocumentModal(file, title) {
    documentModalTitle.textContent = title;
    downloadBtn.href = file;
    fallbackDownloadBtn.href = file;

    // Reset state
    documentLoader.classList.remove('hidden');
    documentFallback.classList.remove('active');
    documentFrame.src = '';

    documentModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (isLocalhost) {
        // Show fallback for localhost
        documentLoader.classList.add('hidden');
        documentFallback.classList.add('active');
    } else {
        // Use Microsoft Office Online Viewer for production
        const fileUrl = encodeURIComponent(window.location.origin + '/' + file);
        const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${fileUrl}`;
        documentFrame.src = viewerUrl;

        documentFrame.onload = () => {
            documentLoader.classList.add('hidden');
        };

        // Fallback timeout
        setTimeout(() => {
            if (!documentLoader.classList.contains('hidden')) {
                documentLoader.classList.add('hidden');
                documentFallback.classList.add('active');
            }
        }, 15000);
    }
}

// Close modals
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';

    if (modal === documentModal) {
        documentFrame.src = '';
    }
}

// Close button handlers
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        closeModal(modal);
    });
});

// Backdrop click to close
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        closeModal(modal);
    });
});

// Escape key to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (imageModal.classList.contains('active')) {
            closeModal(imageModal);
        }
        if (documentModal.classList.contains('active')) {
            closeModal(documentModal);
        }
    }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Set initial scroll state
    handleScroll();

    // Make hero section visible immediately
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.opacity = '1';
        heroSection.style.transform = 'none';
    }
});
