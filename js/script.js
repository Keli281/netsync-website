/**
 * ============================================================
 * NETSYNC LIMITED - MAIN JAVASCRIPT
 * ============================================================
 * All vanilla JS, no dependencies
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================================
    // 1. LOADING SCREEN
    // ============================================================
    const loader = document.getElementById('loader');
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 800);
    });

    setTimeout(function() {
        if (!loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }, 3000);

    // ============================================================
    // 2. NAVIGATION
    // ============================================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });
    }

    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('open');
                if (navToggle) {
                    navToggle.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    document.addEventListener('click', function(e) {
        if (navbar && !navbar.contains(e.target) && navMenu && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            if (navToggle) {
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // ============================================================
    // 3. TYPING EFFECT
    // ============================================================
    const typedElement = document.getElementById('typed-text');
    if (typedElement) {
        const phrases = [
            'Delivering Excellence',
            'Bridging the Gap',
            'Quality Services',
            'Your Trusted Partner'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let speed = 100;

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                speed = 50;
            } else {
                typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                speed = 120;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                speed = 1500;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                speed = 500;
            }

            setTimeout(typeEffect, speed);
        }

        typeEffect();
    }

    // ============================================================
    // 4. SCROLL REVEALS (Intersection Observer)
    // ============================================================
    const revealElements = document.querySelectorAll('.value-card, .dept-card, .client-logo, .info-card');

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseInt(el.getAttribute('data-delay')) || 0;
                setTimeout(function() {
                    el.classList.add('visible');
                }, delay);
                revealObserver.unobserve(el);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });

    document.querySelectorAll('.reveal').forEach(function(el) {
        revealObserver.observe(el);
    });

    // ============================================================
    // 5. COUNTER ANIMATION
    // ============================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        const statsSection = document.querySelector('.about-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
            countersStarted = true;
            statNumbers.forEach(function(stat) {
                const target = parseInt(stat.getAttribute('data-target'));
                if (isNaN(target)) return;
                let current = 0;
                const increment = Math.ceil(target / 60);
                const stepTime = Math.floor(1500 / 60);

                const counterInterval = setInterval(function() {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(counterInterval);
                    }
                    stat.textContent = current + (target === 2023 ? '' : '+');
                }, stepTime);
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
    setTimeout(animateCounters, 500);

    // ============================================================
    // 6. CONTACT FORM
    // ============================================================
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose = document.querySelector('.toast-close');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');

            document.querySelectorAll('.form-group').forEach(function(group) {
                group.classList.remove('error');
            });

            if (name.value.trim().length < 2) {
                name.closest('.form-group').classList.add('error');
                isValid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value.trim())) {
                email.closest('.form-group').classList.add('error');
                isValid = false;
            }

            if (message.value.trim().length < 5) {
                message.closest('.form-group').classList.add('error');
                isValid = false;
            }

            if (!isValid) {
                showToast('Please fix the errors in the form.', 'error');
                return;
            }

            const formData = {
                name: name.value.trim(),
                email: email.value.trim(),
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: message.value.trim(),
                requestQuote: document.getElementById('requestQuote').checked
            };

            console.log('=== NETSYNC CONTACT FORM SUBMISSION ===');
            console.log('Name:', formData.name);
            console.log('Email:', formData.email);
            console.log('Phone:', formData.phone || 'Not provided');
            console.log('Subject:', formData.subject || 'Not provided');
            console.log('Message:', formData.message);
            console.log('Request Quote:', formData.requestQuote ? 'Yes' : 'No');
            console.log('Timestamp:', new Date().toISOString());
            console.log('=========================================');

            const quoteText = formData.requestQuote ? ' We\'ll prepare a formal quote for you.' : '';
            showToast('Thank you, ' + formData.name + '! Your message has been sent.' + quoteText + ' We\'ll get back to you shortly.', 'success');

            contactForm.reset();
        });
    }

    // ============================================================
    // 7. TOAST NOTIFICATION
    // ============================================================
    let toastTimeout = null;

    function showToast(message, type) {
        if (toastTimeout) {
            clearTimeout(toastTimeout);
            toast.classList.remove('show');
        }

        if (toastMessage) toastMessage.textContent = message;
        const icon = toast ? toast.querySelector('.toast-icon i') : null;
        if (icon) {
            icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
        }

        setTimeout(function() {
            if (toast) toast.classList.add('show');
        }, 100);

        toastTimeout = setTimeout(function() {
            if (toast) toast.classList.remove('show');
        }, 6000);
    }

    if (toastClose) {
        toastClose.addEventListener('click', function() {
            if (toast) toast.classList.remove('show');
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        });
    }

    // ============================================================
    // 8. WHATSAPP BUTTON
    // ============================================================
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            console.log('WhatsApp button clicked - redirecting to chat');
        });
    }

    // ============================================================
    // 9. SMOOTH SCROLL
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================================
    // 10. PORTFOLIO FILTER (ON PORTFOLIO PAGE)
    // ============================================================
    const filterTabs = document.querySelectorAll('.filter-tab');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterTabs.length > 0 && portfolioItems.length > 0) {
        filterTabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                // Update active tab
                filterTabs.forEach(function(t) {
                    t.classList.remove('active');
                });
                tab.classList.add('active');

                const filter = tab.getAttribute('data-filter');

                portfolioItems.forEach(function(item) {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.classList.remove('hidden');
                        // Re-trigger animation
                        item.style.animation = 'none';
                        setTimeout(function() {
                            item.style.animation = '';
                        }, 10);
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ============================================================
    // 11. KEYBOARD ACCESSIBILITY
    // ============================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            if (navToggle) {
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        }
    });

    console.log('🚀 Netsync Limited website initialized successfully!');
});