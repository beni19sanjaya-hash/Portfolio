/**
 * Beni Sanjaya Portfolio - Core Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initScrollActiveLinks();
    initStatsCounter();
    initAboutTabs();
    initProjectFilter();
    initProjectModal();
    initContactForm();
});

/* ==========================================================================
   1. Mobile Navigation Menu
   ========================================================================== */
function initMobileNav() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const openMenu = () => {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    };

    const closeMenu = () => {
        mobileNav.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    };

    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/* ==========================================================================
   2. Scroll Active Links Highlight
   ========================================================================== */
function initScrollActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120; // Offset for sticky navbar
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ==========================================================================
   3. Animated Stats Counter (Intersection Observer)
   ========================================================================== */
function initStatsCounter() {
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    if (!statsSection) return;

    const startCounting = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quad formula
                const easeProgress = progress * (2 - progress);
                const currentValue = Math.floor(easeProgress * target);
                
                if (stat.parentNode.id === 'stat-clients') {
                    stat.textContent = `${currentValue}%`;
                } else if (stat.parentNode.id === 'stat-experience') {
                    stat.textContent = `${currentValue}+`;
                } else {
                    stat.textContent = `${currentValue}+`;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    // Make sure it finishes exactly at target
                    stat.textContent = stat.parentNode.id === 'stat-clients' ? `${target}%` : `${target}+`;
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                startCounting();
                animated = true;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
}

/* ==========================================================================
   4. About Tabs & Skills Progress Animation
   ========================================================================== */
function initAboutTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const aboutSection = document.getElementById('about');

    // Function to animate skill progress bars
    const animateSkillBars = () => {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        });
    };

    // Toggle tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const activePane = document.getElementById(`tab-${tabId}`);
            activePane.classList.add('active');

            // If switching to skills, make sure progress bars animate
            if (tabId === 'skills' || tabId === 'softskills') {
                setTimeout(animateSkillBars, 50);
            }
        });
    });

    // Animate skill bars when About section becomes visible
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillsTabActive = document.getElementById('tab-skills').classList.contains('active');
                    const softSkillsTabActive = document.getElementById('tab-softskills').classList.contains('active');
                    if (skillsTabActive || softSkillsTabActive) {
                        animateSkillBars();
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(aboutSection);
    }
}

/* ==========================================================================
   5. Projects Gallery Filtering
   ========================================================================== */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Hide with slide out / fade out animation
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });
}

/* ==========================================================================
   6. Project Case Study Modal (Rich Content Injection)
   ========================================================================== */
const projectData = {
    "3": {
        title: "Website Informasi Beasiswa",
        category: "Projek Berkelompok",
        client: "Projek Sekolah (Tim)",
        role: "Frontend Developer",
        tech: ["HTML5", "CSS3 Flexbox", "Desain Layout", "Kerjasama Tim"],
        description: "Dalam projek berkelompok ini, saya berperan sebagai Frontend Developer untuk membangun portal pencarian dan penyajian informasi beasiswa. Saya bertanggung jawab mendesain layout halaman informasi agar terstruktur rapi dan mudah dibaca oleh calon pendaftar, serta bekerja sama erat dengan anggota tim untuk mengintegrasikan tampilan frontend dengan kode website utama.",
        visualHTML: `<img src="assets/beasiswa.png" alt="Website Informasi Beasiswa" style="width:100%;height:100%;object-fit:cover;">`,
        liveLink: "",
        sourceLink: ""
    },
    "4": {
        title: "Tretan Explore",
        category: "Projek Berkelompok",
        client: "Projek Tim",
        role: "Backend Developer & UI/UX Designer",
        tech: ["HTML", "CSS", "JavaScript", "PHP"],
        description: "Tretan Explore adalah website edukasi wisata Pulau Madura yang dikembangkan secara tim. Website ini menampilkan informasi budaya, galeri destinasi wisata, fitur game edukatif, serta halaman review dari pengguna. Dalam projek ini saya berperan sebagai Backend Developer sekaligus UI/UX Designer, membangun logika backend dan merancang antarmuka yang menarik serta mudah digunakan oleh pengunjung.",
        visualHTML: `<img src="assets/tretan-explore.png" alt="Tretan Explore" style="width:100%;height:100%;object-fit:cover;">`,
        liveLink: "",
        sourceLink: ""
    },
    "5": {
        title: "TravelYuk",
        category: "Projek Individu",
        client: "Projek Individu",
        role: "Backend Developer & UI/UX Designer",
        tech: ["HTML", "CSS", "JavaScript"],
        description: "TravelYuk adalah platform travel yang dikembangkan secara tim untuk membantu pengguna menemukan inspirasi destinasi wisata, tips perjalanan, dan rekomendasi terbaik untuk pengalaman yang tak terlupakan. Saya berperan sebagai Backend Developer sekaligus UI/UX Designer, bertanggung jawab atas logika website dan perancangan antarmuka yang bersih dan intuitif.",
        visualHTML: `<img src="assets/travelyuk.png" alt="TravelYuk" style="width:100%;height:100%;object-fit:cover;">`,
        liveLink: "",
        sourceLink: ""
    }
};

function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Modal Target Elements
    const mVisual = document.getElementById('modal-project-visual');
    const mCat = document.getElementById('modal-project-category');
    const mTitle = document.getElementById('modal-project-title');
    const mDesc = document.getElementById('modal-project-description');
    const mClient = document.getElementById('modal-project-client');
    const mRole = document.getElementById('modal-project-role');
    const mTechList = document.getElementById('modal-project-tech');
    const openModal = (id) => {
        const data = projectData[id];
        if (!data) return;

        // Inject Data
        mVisual.innerHTML = data.visualHTML;
        mCat.textContent = data.category;
        mTitle.textContent = data.title;
        mDesc.textContent = data.description;
        mClient.textContent = data.client;
        mRole.textContent = data.role;
        
        // Build tech tags
        mTechList.innerHTML = '';
        data.tech.forEach(t => {
            const span = document.createElement('span');
            span.textContent = t;
            mTechList.appendChild(span);
        });

        // Open animation
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            openModal(id);
        });
    });

    modalClose.addEventListener('click', closeModal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   7. Contact Form Floating Labels & Real-time Validation
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('form-submit-btn');
    const submitBtnText = submitBtn.querySelector('.btn-text');
    const submitBtnIcon = submitBtn.querySelector('.btn-icon');

    const inputs = [nameInput, emailInput, subjectInput, messageInput];

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const showError = (input) => {
        const group = input.parentElement;
        group.classList.add('error');
    };

    const clearError = (input) => {
        const group = input.parentElement;
        group.classList.remove('error');
    };

    const validateInput = (input) => {
        if (input.value.trim() === '') {
            showError(input);
            return false;
        }

        if (input === emailInput && !validateEmail(input.value.trim())) {
            showError(input);
            return false;
        }

        clearError(input);
        return true;
    };

    // Form inputs blur and input events
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                clearError(input);
            }
        });
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            const fieldValid = validateInput(input);
            if (!fieldValid) isValid = false;
        });

        if (!isValid) return;

        // Visual Feedback (Fake AJAX Send)
        submitBtn.classList.add('loading');
        submitBtnText.textContent = 'Sending Message...';
        submitBtnIcon.className = 'ri-loader-4-line btn-icon ri-spin'; // Rotate loader

        setTimeout(() => {
            // Transition to Success Checkmark
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            submitBtnText.textContent = 'Message Sent!';
            submitBtnIcon.className = 'ri-checkbox-circle-fill btn-icon';

            // Reset after 3 seconds
            setTimeout(() => {
                form.reset();
                submitBtn.classList.remove('success');
                submitBtnText.textContent = 'Send Message';
                submitBtnIcon.className = 'ri-send-plane-fill btn-icon';
            }, 3000);
            
        }, 1800);
    });
}